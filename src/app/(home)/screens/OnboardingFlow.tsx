import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthOnboardingScreen } from './AuthOnboardingScreen';
import { SubjectSelectionOnboardingScreen } from './SubjectSelectionOnboardingScreen';
import { WelcomeOnboardingScreen } from './WelcomeOnboardingScreen';

const ONBOARDING_COMPLETE_KEY = '@quizzo_onboarding_complete';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);

  const handleWelcomeNext = () => {
    setCurrentScreen(1);
  };

  const handleSubjectsNext = (subjects: any[]) => {
    // Store subjects in state, don't save yet
    setSelectedSubjects(subjects);
    AsyncStorage.setItem('@quizzo_selected_subjects', JSON.stringify(subjects));
    setCurrentScreen(2);
  };

  const handleBackToSubjects = () => {
    setCurrentScreen(1);
  }

  const handleAuthComplete = async (
    mode: 'login' | 'signup' | 'guest',
    credentials?: { email: string; password: string },
    sessionData?: { user: any; session: any }
  ) => {
    try {
      // Save auth mode and credentials if needed
      await AsyncStorage.setItem('@quizzo_auth_mode', mode);
      
      if (mode !== 'guest' && credentials) {
        // Save user email
        await AsyncStorage.setItem('@quizzo_user_email', credentials.email);
      }

      // Store session data if available
      if (sessionData) {
        // Store user data
        await AsyncStorage.setItem('@quizzo_user', JSON.stringify(sessionData.user));
        
        // Store session token for API calls
        if (sessionData.session) {
          await AsyncStorage.setItem('@quizzo_access_token', sessionData.session.access_token);
          await AsyncStorage.setItem('@quizzo_refresh_token', sessionData.session.refresh_token);
          await AsyncStorage.setItem('@quizzo_session', JSON.stringify(sessionData.session));
        }

        console.log('Session data stored successfully');
      }

      // Save subject preferences now that auth is complete
      if (selectedSubjects.length > 0) {
        try {
          const response = await fetch(`${API_BASE_URL}/user-subject-preferences`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(sessionData?.session?.access_token && {
                'Authorization': `Bearer ${sessionData.session.access_token}`
              })
            },
            body: JSON.stringify({
              user_id: sessionData?.user?.id || null,
              subjects: selectedSubjects,
            }),
          });

          if (response.ok) {
            console.log('Subject preferences saved successfully');
          } else {
            console.error('Failed to save subject preferences');
          }
        } catch (error) {
          console.error('Error saving subject preferences:', error);
        }
      }

      // Mark onboarding as complete
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      
      // Call the completion callback
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View className="flex-1">
      {currentScreen === 0 && (
        <WelcomeOnboardingScreen onNext={handleWelcomeNext} />
      )}
      {currentScreen === 1 && (
        <SubjectSelectionOnboardingScreen
          onNext={handleSubjectsNext}
        />
      )}
      {currentScreen === 2 && (
        <AuthOnboardingScreen 
          onComplete={(mode, credentials, sessionData) => handleAuthComplete(mode, credentials, sessionData)} 
          onBack={handleBackToSubjects} 
        />
      )}
    </View>
  );
}

export async function checkOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
}
