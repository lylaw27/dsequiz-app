import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Button, Card } from 'heroui-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


const StyledIonicons = withUniwind(Ionicons);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type AuthMode = 'login' | 'signup' | 'guest';

export function AuthOnboardingScreen({
  onComplete,
  onBack,
}: {
  onComplete: (mode: AuthMode, credentials?: { email: string; password: string }, sessionData?: { user: any; session: any }) => void;
  onBack?: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (mode === 'guest') {
      onComplete('guest');
      return;
    }

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      // Store user data and proceed
      console.log('Auth success:', result);
      onComplete(mode, { email, password }, result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Configure Google Sign In (do this once, ideally in app initialization)
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From Google Console
      });

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      if (response?.data?.idToken) {
        // Send ID token to backend for authentication
        const authResponse = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: response.data.idToken }),
        });

        const result = await authResponse.json();

        if (!authResponse.ok) {
          throw new Error(result.error || 'Google authentication failed');
        }

        console.log('Google auth success:', result);
        onComplete('login', { email: result.data.user?.email || '', password: '' }, result.data);
      }
    } catch (err: any) {
      if (err?.code === 'statusCodes.SIGN_IN_CANCELLED') {
        // User cancelled the login flow
        setError(null);
      } else if (err?.code === 'statusCodes.IN_PROGRESS') {
        setError('Sign in is already in progress');
      } else if (err?.code === 'statusCodes.PLAY_SERVICES_NOT_AVAILABLE') {
        setError('Play services not available or outdated');
      } else {
        setError(err instanceof Error ? err.message : 'Google login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: This requires expo-auth-session or react-native-fbsdk-next
      // For Expo managed workflow:
      
      /*
      import * as WebBrowser from 'expo-web-browser';
      
      WebBrowser.maybeCompleteAuthSession();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'your-app-scheme://auth/callback',
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, 'your-app-scheme://auth/callback');
      }
      */

      // Temporary: Show that Facebook Sign-In needs to be configured
      setError('Facebook Sign-In requires additional setup');
      console.log('Facebook Sign-In: Configure expo-auth-session or react-native-fbsdk-next');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Facebook login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: This requires expo-apple-authentication for Expo
      
      /*
      import * as AppleAuthentication from 'expo-apple-authentication';
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) throw error;
        
        console.log('Apple auth success:', data);
        onComplete('login', { email: data.user?.email || '', password: '' }, data);
      }
      */

      // Temporary: Show that Apple Sign-In needs to be configured
      setError('Apple Sign-In requires additional setup');
      console.log('Apple Sign-In: Install expo-apple-authentication and configure');
    } catch (err: any) {
      if (err?.code === 'ERR_CANCELED') {
        // User canceled
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Apple login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Guest sign-in failed');
      }

      console.log('Guest auth success:', result);
      onComplete('guest', undefined, result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Guest sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-5">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Back Button */}
        <View className="px-5 pt-12">
          <Pressable
            onPress={onBack}
            className="size-12 rounded-2xl bg-surface items-center justify-center border border-zinc-200"
          >
            <StyledIonicons name="chevron-back" size={24} className="text-foreground" />
          </Pressable>
        </View>

        {/* Header */}
        <View className="px-5 pt-8 pb-6">
          <AppText className="text-3xl font-bold leading-tight text-center">
            {mode === 'login' ? 'Welcome Back! Glad\nTo See You, Again!' : 'Create Your\nAccount'}
          </AppText>
        </View>

        {/* Error Message */}
        {error && (
          <View className="px-5 mb-4">
            <Card className="bg-red-50 border border-red-200">
              <Card.Body className="p-3">
                <View className="flex-row items-center gap-2">
                  <StyledIonicons name="alert-circle" size={20} className="text-red-600" />
                  <AppText className="text-red-600 text-sm flex-1">{error}</AppText>
                </View>
              </Card.Body>
            </Card>
          </View>
        )}

        {/* Form */}
        <View className="px-5 gap-4">
          <View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          <View className="relative">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base text-foreground"
              placeholderTextColor="#999"
            />
          </View>

          {mode === 'signup' && (
            <View>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-base text-foreground"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {mode === 'login' && (
            <View className="items-end">
              <Pressable>
                <AppText className="text-zinc-600 text-sm font-medium">
                  Forgot Password?
                </AppText>
              </Pressable>
            </View>
          )}

          {/* Submit Button */}
          <Button
            onPress={handleSubmit}
            isDisabled={loading}
            className="mt-4 bg-accent rounded-xl py-4"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Button.Label className="text-white font-semibold text-base">
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Button.Label>
            )}
          </Button>
        </View>

        {/* Social Login */}
        <View className="px-5 mt-8">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="h-px flex-1 bg-zinc-300" />
            <AppText className="text-sm text-zinc-600">Or Login with</AppText>
            <View className="h-px flex-1 bg-zinc-300" />
          </View>

          <View className="flex-row gap-3 justify-center">
            {/* Facebook */}
            <Pressable
              onPress={handleFacebookLogin}
              disabled={loading}
              className="flex-1 items-center justify-center py-4 rounded-xl border border-zinc-200 bg-white"
            >
              <StyledIonicons name="logo-facebook" size={28} className="text-blue-600" />
            </Pressable>

            {/* Google */}
            <Pressable
              onPress={handleGoogleLogin}
              disabled={loading}
              className="flex-1 items-center justify-center py-4 rounded-xl border border-zinc-200 bg-white"
            >
              <StyledIonicons name="logo-google" size={28} className="text-red-600" />
            </Pressable>

            {/* Apple */}
            <Pressable
              onPress={handleAppleLogin}
              disabled={loading}
              className="flex-1 items-center justify-center py-4 rounded-xl border border-zinc-200 bg-white"
            >
              <StyledIonicons name="logo-apple" size={28} className="text-foreground" />
            </Pressable>
          </View>
        </View>

        {/* Guest Option - Only show in login mode */}
        {mode === 'login' && (
          <View className="px-5 mt-6">
            <Button
              onPress={handleGuest}
              variant="outlined"
              className="border-2 border-zinc-300 rounded-xl py-3 bg-zinc-200"
            >
              <Button.Label className="text-foreground font-semibold">
                Continue as Guest
              </Button.Label>
            </Button>
          </View>
        )}

        {/* Sign Up / Login Toggle */}
        <View className="px-5 mt-8 items-center">
          <View className="flex-row items-center gap-1">
            <AppText className="text-sm text-zinc-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </AppText>
            <Pressable
              onPress={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setConfirmPassword('');
              }}
            >
              <AppText className="text-sm text-primary font-semibold">
                {mode === 'login' ? 'Register Now' : 'Login'}
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Progress Indicator */}
        <View className="px-5 mt-8">
          <OnboardingProgressIndicator totalSteps={3} currentStep={2} />
        </View>
      </ScrollView>
    </View>
  );
}
