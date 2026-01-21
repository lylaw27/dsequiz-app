import { View } from 'react-native';

interface OnboardingProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function OnboardingProgressIndicator({
  totalSteps,
  currentStep,
}: OnboardingProgressIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === currentStep
              ? 'w-8 bg-accent'
              : 'w-2 bg-accent/30'
          }`}
        />
      ))}
    </View>
  );
}
