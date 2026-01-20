import { StatusBar } from 'expo-status-bar';
import react from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from '../../components/safe-area-view';
import { useAppTheme } from '../../contexts/app-theme-context';
import { BottomNavigation } from '../../components/bottom-navigation';
import { AnimatedTabView } from '../../components/animated-tab-view';
import { HomeScreen } from './screens/HomeScreen';
import { DailyScreen } from './screens/DailyScreen';
import { MockScreen } from './screens/MockScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OnboardingFlow, checkOnboardingComplete } from './screens/OnboardingFlow';

export default function HomePage() {
  const { isDark } = useAppTheme();
  const [activeTab, setActiveTab] = react.useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = react.useState<boolean | null>(null);

  react.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const complete = await checkOnboardingComplete();
    setIsOnboardingComplete(complete);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  // Loading state
  if (isOnboardingComplete === null) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  // Show onboarding if not complete
  if (!isOnboardingComplete) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  // Show main app
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AnimatedTabView
        activeIndex={activeTab}
        onIndexChange={setActiveTab}
        swipeable={true}
      >
        <HomeScreen />
        <DailyScreen />
        <MockScreen />
        <ProfileScreen />
      </AnimatedTabView>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
