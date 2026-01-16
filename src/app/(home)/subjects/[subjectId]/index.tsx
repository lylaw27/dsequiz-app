import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { BottomNavigation } from '../../../../components/bottom-navigation';
import { SafeAreaView } from '../../../../components/safe-area-view';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { QuizCard, QuizData } from '../../components/QuizCard';
import { MCQSet, Subject, mapMCQSetToQuizData } from '../../types';

const StyledIonicons = withUniwind(Ionicons);

// API Configuration - update this with your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function QuizListPage() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  
  const [subject, setSubject] = react.useState<Subject | null>(null);
  const [quizzes, setQuizzes] = react.useState<QuizData[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);

  react.useEffect(() => {
    if (subjectId) {
      fetchSubjectAndMCQSets();
    }
  }, [subjectId]);

  const fetchSubjectAndMCQSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch subject details
      const subjectResponse = await fetch(`${API_BASE_URL}/subjects/${subjectId}`);
      if (!subjectResponse.ok) {
        throw new Error('Failed to fetch subject details');
      }
      const subjectResult = await subjectResponse.json();
      setSubject(subjectResult.data);
      
      // Fetch MCQ sets for this subject
      const response = await fetch(`${API_BASE_URL}/mcqsets?subject_id=${subjectId}`);
      
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
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <AppText className="text-muted mt-4">正在載入題目...</AppText>
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
          <AppText className="text-lg font-semibold mb-2">載入題目時發生錯誤</AppText>
          <AppText className="text-muted text-center mb-4">{error}</AppText>
          <Button onPress={fetchSubjectAndMCQSets}>
            <Button.Label>重試</Button.Label>
          </Button>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Back button */}
        <View className="px-5 pt-4 pb-2">
          <Pressable 
            onPress={() => router.back()}
            className="flex-row items-center gap-2"
          >
            <StyledIonicons 
              name="arrow-back" 
              size={24} 
              className="text-foreground"
            />
            <AppText className="text-base">返回</AppText>
          </Pressable>
        </View>
        
        <View className="px-5 pt-2 pb-4">
          <AppText className="text-3xl font-bold">{subject?.name || '題目列表'}</AppText>
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
            <AppText className="text-lg font-semibold mb-2">暫沒題目</AppText>
          </View>
        ) : (
          <View className="gap-4 px-5">
            {quizzes.map((quiz, index) => (
              <QuizCard key={quiz.id} {...quiz} index={index} />
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
