import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStoredUserId = async (): Promise<string | null> => {
  try {
    const storedUser = await AsyncStorage.getItem('@quizzo_user');
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.id || null;
  } catch (err) {
    console.error('Error reading stored user:', err);
    return null;
  }
};
