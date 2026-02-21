import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, cn } from 'heroui-native';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { useLanguage } from '../../../contexts/language-context';
import { getStoredUserId } from '../../../helpers/utils/auth-storage';
import { resetOnboardingForTesting } from '../../../helpers/utils/onboarding-utils';
import { AvatarSelectionModal } from '../components/AvatarSelectionModal';
import { SubjectsSelectionModal } from '../components/SubjectsSelectionModal';
import { CompletedQuestionsScreen } from './CompletedQuestionsScreen';

const AVATAR_STORAGE_KEY = '@user_avatar';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface Subject {
  id: string;
  name: string;
  eng_name?: string;
  icon?: string;
  enabled: boolean;
  order: number;
  description?: string;
  image_url?: string;
}

export function ProfileScreen() {
  const { isDark, toggleTheme } = useAppTheme();
  const { language, toggleLanguage, t } = useLanguage();
  
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [showCompletedQuestions, setShowCompletedQuestions] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [isSignedIn] = useState(false); // TODO: Implement actual auth
  const [userEmail] = useState('user@example.com'); // TODO: Get from auth

  useEffect(() => {
    loadUserPreferences();
    fetchUserSubjects();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if (savedAvatar) setUserAvatar(savedAvatar);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const fetchUserSubjects = async () => {
    try {
      const userId = await getStoredUserId();
      const response = await fetch(`${API_BASE_URL}/user-subject-preferences/${userId || 'null'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const result = await response.json();
      
      // Filter only enabled subjects
      const enabledSubjects = result.data.filter((s: Subject) => s.enabled);
      setSelectedSubjects(enabledSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAvatarSelect = async (avatar: string) => {
    setUserAvatar(avatar);
    try {
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, avatar);
    } catch (error) {
      console.error('Error saving avatar:', error);
      // Still keep the avatar in state even if storage fails
    }
  };

  const handleSubjectsSelect = async (subjects: Subject[]) => {
    // Filter only enabled subjects for display
    const enabledSubjects = subjects.filter(s => s.enabled);
    setSelectedSubjects(enabledSubjects);
    
    // Refresh subjects from backend to ensure sync
    await fetchUserSubjects();
  };

  const openSocialMedia = (url: string) => {
    Linking.openURL(url);
  };

  // If showing completed questions, render that screen
  if (showCompletedQuestions) {
    return <CompletedQuestionsScreen onBack={() => setShowCompletedQuestions(false)} />;
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="gap-6">
          {/* Avatar & User Info */}
          <View className="items-center gap-4">
            <Pressable onPress={() => setShowAvatarModal(true)}>
              <View className="relative">
                <Avatar size="lg" alt="User Avatar" className="w-24 h-24">
                  <Avatar.Image source={{ uri: userAvatar }} />
                  <Avatar.Fallback />
                </Avatar>
                <View className="absolute bottom-0 right-0 bg-accent rounded-full p-2">
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </View>
            </Pressable>
            <View className="items-center">
              {isSignedIn ? (
                <>
                  <AppText className="text-2xl font-bold text-foreground">
                    {t('profile.username')}
                  </AppText>
                  <AppText className="text-muted">
                    {userEmail}
                  </AppText>
                </>
              ) : (
                <Pressable className="flex-row items-center gap-2">
                  <Ionicons name="log-in-outline" size={20} color="#007AFF" />
                  <AppText className="text-accent font-semibold">
                    {t('profile.sign_in')}
                  </AppText>
                </Pressable>
              )}
            </View>
          </View>

          {/* Stats Card */}
          <Card className="p-4 gap-3">
            <AppText className="text-lg font-semibold text-foreground">
              {t('profile.learning_stats')}
            </AppText>
            <View className="flex-row justify-around">
              <Pressable 
                className="items-center"
                onPress={() => setShowCompletedQuestions(true)}
              >
                <AppText className="text-2xl font-bold text-accent">127</AppText>
                <AppText className="text-sm text-muted">{t('profile.completed')}</AppText>
              </Pressable>
              <View className="items-center">
                <AppText className="text-2xl font-bold text-accent">85%</AppText>
                <AppText className="text-sm text-muted">{t('profile.accuracy')}</AppText>
              </View>
              <View className="items-center">
                <AppText className="text-2xl font-bold text-accent">12</AppText>
                <AppText className="text-sm text-muted">{t('profile.streak_days')}</AppText>
              </View>
            </View>
          </Card>

          {/* Settings Section */}
          <Card className="p-4 gap-3">
            <AppText className="text-lg font-semibold text-foreground mb-2">
              {t('profile.settings')}
            </AppText>

            {/* My Subjects */}
            <Pressable 
              onPress={() => setShowSubjectsModal(true)}
              className="flex-row items-center justify-between py-3 px-4 rounded-xl bg-background"
            >
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-xl bg-accent/10 items-center justify-center">
                  <Ionicons name="book-outline" size={20} color="#007AFF" />
                </View>
                <View>
                  <AppText className="text-base font-medium text-foreground">
                    {t('profile.my_subjects')}
                  </AppText>
                  <AppText className="text-sm text-muted">
                    {selectedSubjects.length > 0 
                      ? t('profile.subjects_selected', { count: selectedSubjects.length })
                      : t('profile.select_subjects')}
                  </AppText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666878" />
            </Pressable>

            {/* Theme Toggle */}
            <Pressable 
              onPress={toggleTheme}
              className="flex-row items-center justify-between py-3 px-4 rounded-xl bg-background"
            >
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-xl bg-accent/10 items-center justify-center">
                  <Ionicons 
                    name={isDark ? 'moon' : 'sunny'} 
                    size={20} 
                    color="#007AFF" 
                  />
                </View>
                <AppText className="text-base font-medium text-foreground">
                  {isDark ? t('profile.dark_mode') : t('profile.light_mode')}
                </AppText>
              </View>
              <View className={cn(
                'w-12 h-7 rounded-full p-1',
                isDark ? 'bg-accent' : 'bg-zinc-300'
              )}>
                <View className={cn(
                  'w-5 h-5 rounded-full bg-white transition-all',
                  isDark && 'ml-auto'
                )} />
              </View>
            </Pressable>

            {/* Language Toggle */}
            <Pressable 
              onPress={toggleLanguage}
              className="flex-row items-center justify-between py-3 px-4 rounded-xl bg-background"
            >
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-xl bg-accent/10 items-center justify-center">
                  <Ionicons name="language" size={20} color="#007AFF" />
                </View>
                <AppText className="text-base font-medium text-foreground">
                  語言 / Language
                </AppText>
              </View>
              <AppText className="text-accent font-semibold">
                {language === 'zh' ? '中文' : 'English'}
              </AppText>
            </Pressable>
          </Card>

          {/* Follow Us Section */}
          <Card className="p-4 gap-3">
            <AppText className="text-lg font-semibold text-foreground mb-2">
              {t('profile.follow_us')}
            </AppText>
            <View className="flex-row gap-3">
              <Pressable 
                onPress={() => openSocialMedia('https://facebook.com')}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-[#1877F2]"
              >
                <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
                <AppText className="text-white font-semibold">Facebook</AppText>
              </Pressable>
              <Pressable 
                onPress={() => openSocialMedia('https://instagram.com')}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
                style={{ backgroundColor: '#E1306C' }}
              >
                <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
                <AppText className="text-white font-semibold">Instagram</AppText>
              </Pressable>
            </View>
          </Card>

          {/* Sign Out Button */}
          {isSignedIn && (
            <Pressable 
              className="w-full py-3 rounded-xl border-2 border-red-500 flex-row items-center justify-center gap-2"
              onPress={() => console.log('Sign out')}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <AppText className="text-red-500 ml-2 font-semibold">{t('profile.sign_out')}</AppText>
            </Pressable>
          )}

          {/* Development: Reset Onboarding Button */}
          {__DEV__ && (
            <Pressable 
              className="w-full py-3 rounded-xl border-2 border-orange-500 flex-row items-center justify-center gap-2"
              onPress={() => {
                console.log('Reset button pressed');
                
                if (Platform.OS === 'web') {
                  // Web-specific confirmation
                  const confirmed = window.confirm(
                    'Reset Onboarding\n\nThis will clear all onboarding data and user preferences. You will need to restart the app.\n\nDo you want to continue?'
                  );
                  
                  if (confirmed) {
                    resetOnboardingForTesting().then((success) => {
                      console.log('Reset result:', success);
                      if (success) {
                        window.alert(
                          'Success\n\nAll onboarding data has been cleared. Please refresh the page to see the onboarding flow.'
                        );
                      } else {
                        window.alert('Error\n\nFailed to reset onboarding data.');
                      }
                    });
                  }
                } else {
                  // Native Alert for iOS/Android
                  Alert.alert(
                    'Reset Onboarding',
                    'This will clear all onboarding data and user preferences. You will need to restart the app.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Reset', 
                        style: 'destructive',
                        onPress: async () => {
                          console.log('Resetting onboarding...');
                          const success = await resetOnboardingForTesting();
                          console.log('Reset result:', success);
                          if (success) {
                            Alert.alert(
                              'Success', 
                              'All onboarding data has been cleared. Please close and restart the app to see the onboarding flow.',
                              [{ text: 'OK' }]
                            );
                          } else {
                            Alert.alert('Error', 'Failed to reset onboarding data.');
                          }
                        }
                      }
                    ]
                  );
                }
              }}
            >
              <Ionicons name="refresh-outline" size={20} color="#F97316" />
              <AppText className="text-orange-500 ml-2 font-semibold">Reset Onboarding (Dev)</AppText>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <AvatarSelectionModal
        visible={showAvatarModal}
        currentAvatar={userAvatar}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
      />
      <SubjectsSelectionModal
        visible={showSubjectsModal}
        selectedSubjects={selectedSubjects}
        onClose={() => setShowSubjectsModal(false)}
        onSelect={handleSubjectsSelect}
      />
    </View>
  );
}
