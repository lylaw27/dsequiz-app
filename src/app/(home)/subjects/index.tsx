import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { BottomNavigation } from '../../../components/bottom-navigation';
import { SafeAreaView } from '../../../components/safe-area-view';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { QuizCard, QuizData } from '../components/QuizCard';
import { Subject, mapSubjectToQuizData } from '../types';

const StyledIonicons = withUniwind(Ionicons);

// API Configuration - update this with your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function SubjectsPage() {
  const { isDark } = useAppTheme();
  const [subjects, setSubjects] = react.useState<QuizData[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);

  react.useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/subjects`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const result = await response.json();
      const subjectsData: Subject[] = result.data || [];
      
      // Fetch count of mcqsets for each subject
      const subjectsWithCount = await Promise.all(
        subjectsData.map(async (subject, index) => {
          try {
            const countResponse = await fetch(`${API_BASE_URL}/mcqsets?subject_id=${subject.id}`);
            const countResult = await countResponse.json();
            const count = countResult.data?.length || 0;
            
            const mappedSubject = mapSubjectToQuizData(subject, index);
            return {
              ...mappedSubject,
              quizCount: count,
            };
          } catch (err) {
            console.error(`Error fetching count for subject ${subject.id}:`, err);
            return mapSubjectToQuizData(subject, index);
          }
        })
      );
      
      setSubjects(subjectsWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <AppText className="text-muted mt-4">正在載入科目...</AppText>
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
          <AppText className="text-lg font-semibold mb-2">載入科目時發生錯誤</AppText>
          <AppText className="text-muted text-center mb-4">{error}</AppText>
          <Button onPress={fetchSubjects}>
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
        <View className="px-5 pt-6 pb-4">
          <AppText className="text-3xl font-bold">選擇科目</AppText>
        </View>
        <View className="px-5 pb-4">
          <AppText className="text-muted">選擇你想練習的科目</AppText>
        </View>
        {subjects.length === 0 ? (
          <View className="items-center justify-center px-5 py-12">
            <StyledIonicons 
              name="folder-open-outline" 
              size={64} 
              className="text-muted mb-4"
            />
            <AppText className="text-lg font-semibold mb-2">暫無科目</AppText>
          </View>
        ) : (
          <View className="gap-4 px-5">
            {subjects.map((subject, index) => (
              <QuizCard key={subject.id} {...subject} index={index} isSubject />
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
