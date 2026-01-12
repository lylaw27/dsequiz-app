import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { SafeAreaView } from '../../components/safe-area-view';
import { BottomNavigation } from '../../components/bottom-navigation';
import { useAppTheme } from '../../contexts/app-theme-context';
import { QuizCard, QuizData } from './components/QuizCard';

const StyledIonicons = withUniwind(Ionicons);

// API Configuration - update this with your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export type MCQSet = {
  id: string;
  topic: string;
  description: string | null;
  count: number;
  subject: string;
  created_at: string | null;
  updated_at: string | null;
};

// Helper function to map MCQSet to QuizData
export const mapMCQSetToQuizData = (mcqSet: MCQSet, index: number): QuizData => {
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
    quizCount: mcqSet.count, // Will be updated when we fetch detailed data
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

export default function QuizListPage() {
  const { isDark } = useAppTheme();
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
        <View className="px-5 pt-6 pb-4">
          <AppText className="text-3xl font-bold">DSE中文12篇範文</AppText>
        </View>
        <View className="px-5 pb-4">
          <AppText className="text-muted">*題目將於 00:00 準時刷新</AppText>
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
      {/* <FloatingActionButton /> */}
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
