import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Button, Card, cn } from 'heroui-native';
import { useEffect, useState, type FC } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { SafeAreaView } from '../../components/safe-area-view';
import { useAppTheme } from '../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);
const StyledIonicons = withUniwind(Ionicons);

// API Configuration - update this with your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type MCQSet = {
  id: string;
  topic: string;
  description: string | null;
  subject: string;
  created_at: string | null;
  updated_at: string | null;
};

type QuizData = {
  id: string;
  title: string;
  quizCount: number;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  peopleJoined: number;
  avatars: string[];
};

// Helper function to map MCQSet to QuizData
const mapMCQSetToQuizData = (mcqSet: MCQSet, index: number): QuizData => {
  const colors = [
    { icon: '#6366f1', bg: '#e0e7ff' },
    { icon: '#ec4899', bg: '#fce7f3' },
    { icon: '#10b981', bg: '#d1fae5' },
    { icon: '#f59e0b', bg: '#fef3c7' },
    { icon: '#8b5cf6', bg: '#ede9fe' },
  ];
  
  const icons = [
    'function-outline',
    'help-circle-outline',
    'bar-chart-outline',
    'book-outline',
    'school-outline',
  ];

  const colorIndex = index % colors.length;
  const iconIndex = index % icons.length;

  return {
    id: mcqSet.id,
    title: mcqSet.topic,
    quizCount: 0, // Will be updated when we fetch detailed data
    icon: icons[iconIndex],
    iconColor: colors[colorIndex].icon,
    iconBgColor: colors[colorIndex].bg,
    peopleJoined: Math.floor(Math.random() * 500) + 100, // Placeholder
    avatars: [
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 1}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 2}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 3}`,
    ],
  };
};

const FloatingActionButton: FC = () => {
  const { isDark } = useAppTheme();

  return (
    <View className="absolute bottom-24 self-center">
      <Pressable
        className="size-16 rounded-full bg-accent items-center justify-center shadow-lg"
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <StyledFeather name="plus" size={28} className="text-white" />
      </Pressable>
    </View>
  );
};

const BottomNavigation: FC = () => {
  const { isDark } = useAppTheme();

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-surface',
        isDark && 'border-zinc-800'
      )}
    >
      <View className="flex-row items-center justify-around py-3 px-4">
        <View className="items-center gap-1">
          <StyledIonicons
            name="home-outline"
            size={24}
            className="text-muted"
          />
          <AppText className="text-muted text-xs">Home</AppText>
        </View>
        <View
          className="items-center gap-1 bg-primary/10 px-4 py-2 rounded-full"
        >
          <StyledIonicons
            name="grid-outline"
            size={24}
            className="text-primary"
          />
          <AppText className="text-primary text-xs font-medium">
            Quizzes
          </AppText>
        </View>
        <View className="items-center gap-1">
          <StyledIonicons
            name="bar-chart-outline"
            size={24}
            className="text-muted"
          />
          <AppText className="text-muted text-xs">leaderboard</AppText>
        </View>
        <View className="items-center gap-1">
          <StyledIonicons
            name="people-outline"
            size={24}
            className="text-muted"
          />
          <AppText className="text-muted text-xs">Friends</AppText>
        </View>
      </View>
    </View>
  );
};

export default function QuizListPage() {
  const { isDark } = useAppTheme();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        <View className="px-5 pt-6 pb-4">
          <AppText className="text-4xl font-bold">Your Quizzes</AppText>
        </View>
        {quizzes.length === 0 ? (
          <View className="items-center justify-center px-5 py-12">
            <StyledIonicons 
              name="folder-open-outline" 
              size={64} 
              className="text-muted mb-4"
            />
            <AppText className="text-lg font-semibold mb-2">No Quizzes Yet</AppText>
            <AppText className="text-muted text-center">
              Start by creating your first quiz!
            </AppText>
          </View>
        ) : (
          <View className="gap-4 px-5">
            {quizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} {...quiz} index={index} />
            ))}
          </View>
        )}
      </ScrollView>
      <FloatingActionButton />
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
