import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthOnboardingScreen } from './AuthOnboardingScreen';
import { SubjectSelectionOnboardingScreen } from './SubjectSelectionOnboardingScreen';
import { WelcomeOnboardingScreen } from './WelcomeOnboardingScreen';

const ONBOARDING_COMPLETE_KEY = '@quizzo_onboarding_complete';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleWelcomeNext = () => {
    setCurrentScreen(1);
  };

  const handleSubjectsNext = (subjects: any[]) => {
    // Save selected subjects to AsyncStorage
    AsyncStorage.setItem('@quizzo_selected_subjects', JSON.stringify(subjects));
    setCurrentScreen(2);
  };

  const handleAuthComplete = async (
    mode: 'login' | 'signup' | 'guest',
    credentials?: { email: string; password: string }
  ) => {
    try {
      // Save auth mode and credentials if needed
      await AsyncStorage.setItem('@quizzo_auth_mode', mode);
      
      if (mode !== 'guest' && credentials) {
        // Here you would typically make an API call to authenticate
        // For now, we'll just save to AsyncStorage
        await AsyncStorage.setItem('@quizzo_user_email', credentials.email);
      }

      // Mark onboarding as complete
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      
      // Call the completion callback
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSkip = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      await AsyncStorage.setItem('@quizzo_auth_mode', 'guest');
      
      // Call the completion callback
      onComplete();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  return (
    <View className="flex-1">
      {currentScreen === 0 && (
        <WelcomeOnboardingScreen onNext={handleWelcomeNext} onSkip={handleSkip} />
      )}
      {currentScreen === 1 && (
        <SubjectSelectionOnboardingScreen
          onNext={handleSubjectsNext}
          onSkip={handleSkip}
        />
      )}
      {currentScreen === 2 && (
        <AuthOnboardingScreen onComplete={handleAuthComplete} />
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
