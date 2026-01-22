import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Development utility to reset onboarding flow
 * Call this from ProfileScreen or a dev menu to test onboarding again
 */
export async function resetOnboardingForTesting() {
  try {
    await AsyncStorage.multiRemove([
      '@quizzo_onboarding_complete',
      '@quizzo_selected_subjects',
      '@quizzo_auth_mode',
      '@quizzo_user_email',
      '@user_avatar',
      '@user_subjects',
    ]);
    console.log('Onboarding data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    return false;
  }
}

/**
 * Get user's selected subjects from onboarding
 */
export async function getSelectedSubjects() {
  try {
    const subjects = await AsyncStorage.getItem('@quizzo_selected_subjects');
    return subjects ? JSON.parse(subjects) : [];
  } catch (error) {
    console.error('Error getting selected subjects:', error);
    return [];
  }
}

/**
 * Get user's auth mode
 */
export async function getAuthMode() {
  try {
    return await AsyncStorage.getItem('@quizzo_auth_mode');
  } catch (error) {
    console.error('Error getting auth mode:', error);
    return null;
  }
}
