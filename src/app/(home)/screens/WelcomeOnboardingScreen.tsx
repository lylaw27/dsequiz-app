import Feather from '@expo/vector-icons/Feather';
import { Button, Card } from 'heroui-native';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';

export function WelcomeOnboardingScreen({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {

  return (
    <View className="flex-1 bg-background">
      {/* Skip Button */}
      <View className="absolute right-5 top-12 z-10">
        <Pressable onPress={onSkip}>
          <AppText className="text-base font-medium text-primary">Skip</AppText>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        {/* Illustration */}
        <View className="h-[65%] w-full items-center justify-center px-5">
          <View className="relative h-full w-full items-center justify-center">
            {/* Diagonal Pink Band */}
            <View className="absolute h-32 w-full rotate-12 bg-pink-300 opacity-70" />
            
            {/* Welcome Text */}
            <View className="z-10">
              <AppText
                className="text-7xl font-bold text-primary"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                Welcome
              </AppText>
            </View>

            {/* Hand with Strawberry Illustration */}
            <View className="absolute bottom-0 right-8">
              {/* Simplified hand illustration - you can replace with actual image/lottie */}
              <View className="h-48 w-48 items-center justify-center">
                <AppText className="text-9xl">🍓</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Text Content */}
        <Card className="w-full h-[35%] rounded-b-none">
          <Card.Body className="p-4 items-center gap-4">
            <AppText className="text-center text-3xl font-bold">
              Welcome To Quizzo!
            </AppText>
            <AppText className="text-center text-base text-muted">
              Compete with friends, earn points, and climb the leaderboard in
              this addictive trivia challenge.
            </AppText>

            {/* Progress Indicator */}
            <View className="mt-6 w-full flex-row items-center">
              <OnboardingProgressIndicator totalSteps={3} currentStep={0} />
            </View>
          </Card.Body>
        </Card>
      </View>

      {/* Next Button */}
      <View className="absolute bottom-12 right-5">
        <Button
          size="sm"
          onPress={onNext}
          className="h-17 w-17 rounded-full bg-accent"
        >
          <Button.Label className="text-4xl text-white flex items-center justify-center">
            {/* <FontAwesome5 name="arrow-right" size={30} color="white" /> */}
            <Feather name="arrow-right" size={40} color="white" />
          </Button.Label>
        </Button>
      </View>
    </View>
  );
}
