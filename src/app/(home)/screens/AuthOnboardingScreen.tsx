import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Button, Card } from 'heroui-native';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';

type AuthMode = 'login' | 'signup' | 'guest';

export function AuthOnboardingScreen({
  onComplete,
}: {
  onComplete: (mode: AuthMode, credentials?: { email: string; password: string }) => void;
}) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (mode === 'guest') {
      onComplete('guest');
    } else {
      onComplete(mode, { email, password });
    }
  };

  const handleGuest = () => {
    onComplete('guest');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-20" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="mb-8">
          <AppText className="text-center text-3xl font-bold">
            {mode === 'login' ? 'Welcome Back!' : mode === 'signup' ? 'Create Account' : 'Continue as Guest'}
          </AppText>
          <AppText className="mt-2 text-center text-base text-muted">
            {mode === 'login'
              ? 'Sign in to continue your quiz journey'
              : mode === 'signup'
              ? 'Join thousands of quiz enthusiasts'
              : 'No account needed, start playing now'}
          </AppText>
        </View>

        {/* Auth Mode Toggle */}
        <View className="mb-6 flex-row gap-3">
          <Button
            onPress={() => setMode('login')}
            className={`flex-1 ${
              mode === 'login' ? 'bg-primary' : 'bg-surface'
            }`}
          >
            <Button.Label
              className={mode === 'login' ? 'text-white' : 'text-foreground'}
            >
              Login
            </Button.Label>
          </Button>
          <Button
            onPress={() => setMode('signup')}
            className={`flex-1 ${
              mode === 'signup' ? 'bg-primary' : 'bg-surface'
            }`}
          >
            <Button.Label
              className={mode === 'signup' ? 'text-white' : 'text-foreground'}
            >
              Sign Up
            </Button.Label>
          </Button>
        </View>

      {/* Form */}
      {mode !== 'guest' && (
        <Card>
          <Card.Body className="gap-4 p-5">
            <View>
              <AppText className="mb-2 text-sm font-medium">
                Email
              </AppText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="rounded-xl border border-default-300 bg-surface px-4 py-3 text-base text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            <View>
              <AppText className="mb-2 text-sm font-medium">
                Password
              </AppText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                className="rounded-xl border border-default-300 bg-surface px-4 py-3 text-base text-foreground"
                placeholderTextColor="#999"
              />
            </View>

            {mode === 'signup' && (
              <View>
                <AppText className="mb-2 text-sm font-medium">
                  Confirm Password
                </AppText>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  className="rounded-xl border border-default-300 bg-surface px-4 py-3 text-base text-foreground"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              className="mt-4 bg-primary"
            >
              <Button.Label className="text-white font-semibold">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button.Label>
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Guest Option */}
      <View className="mt-6">
        <View className="flex-row items-center gap-4">
          <View className="h-px flex-1 bg-default-300" />
          <AppText className="text-sm text-muted">OR</AppText>
          <View className="h-px flex-1 bg-default-300" />
        </View>

        <Button
          onPress={handleGuest}
          variant="outlined"
          className="mt-4 border-2 border-primary"
        >
          <Button.Label className="text-primary font-semibold">
            Continue as Guest
          </Button.Label>
        </Button>
      </View>

      {/* Progress Indicator */}
      <View className="mt-12">
        <OnboardingProgressIndicator totalSteps={3} currentStep={2} />
      </View>
      </ScrollView>
    </View>
  );
}
