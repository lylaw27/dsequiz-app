import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import react from 'react';
import { Avatar, Button, Card, Chip, cn } from 'heroui-native';
import type { FC } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { SafeAreaView } from '../../components/safe-area-view';
import { BottomNavigation } from '../../components/bottom-navigation';
import { useAppTheme } from '../../contexts/app-theme-context';
import { QuizCard, QuizData } from './components/QuizCard';
import { mapMCQSetToQuizData, MCQSet } from './quizList';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);
const StyledIonicons = withUniwind(Ionicons);

// API Configuration - update this with your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function HomePage() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const [quizzes, setQuizzes] = react.useState<QuizData[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);

  react.useEffect(() => {
    fetchMCQSets();
  }, []);

  const fetchMCQSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/mcqsets`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch MCQ sets');
      }

      const result = await response.json();
      const mcqSets: MCQSet[] = result.data || [];
      
      // Map MCQ sets to quiz data
      const mappedQuizzes = mcqSets.map((mcqSet, index) => 
        mapMCQSetToQuizData(mcqSet, index)
      );
      
      setQuizzes(mappedQuizzes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching MCQ sets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <AppText className="text-muted mt-4">Loading quizzes...</AppText>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-5">
          <StyledIonicons 
            name="alert-circle-outline" 
            size={64} 
            className="text-muted mb-4"
          />
          <AppText className="text-lg font-semibold mb-2">Error Loading Quizzes</AppText>
          <AppText className="text-muted text-center mb-4">{error}</AppText>
          <Button onPress={fetchMCQSets}>
            <Button.Label>Retry</Button.Label>
          </Button>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <StyledIonicons name="sunny-outline" size={20} className="text-primary" />
                <AppText className="text-primary text-xs font-semibold tracking-wider">
                  GOOD MORNING
                </AppText>
              </View>
              <AppText className="text-4xl font-bold">Amitesh</AppText>
            </View>
            <Avatar size="lg" alt="User Avatar">
              <Avatar.Image source={{ uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=100' }} />
              <Avatar.Fallback />
            </Avatar>
          </View>
        </View>

        {/* 熱門題庫 Section */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <AppText className="text-2xl font-bold">熱門題庫</AppText>
            {/* <Button size="md" className="bg-primary rounded-full">
              <StyledFeather name="plus" size={16} className="text-white mr-1" />
              <Button.Label className="text-white">Quiz code</Button.Label>
            </Button> */}
          </View>

          {/* Featured Quiz Card */}
          <Card className="p-0 overflow-hidden rounded-2xl">
            <View className="relative">
              {/* Background Gradient Layers */}
              {/* <View className="absolute inset-0 bg-red-500" /> */}
              {/* <View className="absolute inset-0 bg-blue-600" style={{ top: 60 }} /> */}
              <View className="absolute inset-0 bg-black/60"/>
              
              {/* Content */}
              <Card.Body className="p-4">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-2">
                    <Chip size="md" className="bg-white">
                      <Chip.Label className="text-red-600 text-xs">
                        General Knowledge
                      </Chip.Label>
                    </Chip>
                    <Chip size="md" className="bg-white/90">
                      <Chip.Label className="text-zinc-800 text-xs">
                        2min
                      </Chip.Label>
                    </Chip>
                  </View>
                  <Pressable className="size-8 rounded-full bg-white/20 items-center justify-center">
                    <StyledFeather name="x" size={18} className="text-white" />
                  </Pressable>
                </View>

                <AppText className="text-white text-2xl font-bold mb-1">
                  Saturday night Quiz
                </AppText>
                <AppText className="text-white/90 text-sm mb-2">
                  13 Quizzes
                </AppText>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Avatar size="sm" alt="Brandon">
                      <Avatar.Image source={{ uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=7' }} />
                      <Avatar.Fallback />
                    </Avatar>
                    <View>
                      <AppText className="text-white/70 text-xs">Shared By</AppText>
                      <AppText className="text-white text-xs">
                        Brandon Matrovs
                      </AppText>
                    </View>
                  </View>
                  <Button size="sm" className="bg-accent rounded-full">
                    <Button.Label className="text-white text-sm">
                      Start Now
                    </Button.Label>
                  </Button>
                </View>
              </Card.Body>
            </View>
          </Card>
        </View>

        {/* 為你推薦 Section */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <AppText className="text-2xl font-bold">為你推薦</AppText>
            <Pressable>
              <AppText className="text-primary text-base font-medium">See all</AppText>
            </Pressable>
          </View>

          <View className="gap-4">
            {/* {recommendedQuizzes.map((quiz) => (
              <RecommendedQuizCard key={quiz.id} {...quiz} />
            ))} */}
            {quizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} {...quiz} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
