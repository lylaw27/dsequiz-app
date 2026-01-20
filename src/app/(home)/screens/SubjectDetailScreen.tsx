import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import { QuizCard, QuizData } from '../components/QuizCard';
import { MCQSet, Subject, mapMCQSetToQuizData } from '../types';

const StyledIonicons = withUniwind(Ionicons);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface SubjectDetailScreenProps {
  subjectId: string;
  onBack: () => void;
}

export function SubjectDetailScreen({ subjectId, onBack }: SubjectDetailScreenProps) {
  const router = useRouter();
  const { t } = useLanguage();
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
      <View style={{ flex: 1 }} className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <AppText className="text-muted mt-4">{t('subject_detail.loading_questions')}</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1 }} className="bg-background items-center justify-center px-5">
        <StyledIonicons 
          name="alert-circle-outline" 
          size={64} 
          className="text-muted mb-4"
        />
        <AppText className="text-lg font-semibold mb-2">{t('subject_detail.loading_error')}</AppText>
        <AppText className="text-muted text-center mb-4">{error}</AppText>
        <Button onPress={fetchSubjectAndMCQSets}>
          <Button.Label>{t('common.retry')}</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Back button */}
        <View className="px-6 pt-4 pb-2">
          <Pressable 
            onPress={onBack}
            className="flex-row items-center gap-2"
          >
            <StyledIonicons 
              name="arrow-back" 
              size={24} 
              className="text-foreground"
            />
            <AppText className="text-base">{t('common.back')}</AppText>
          </Pressable>
        </View>
        
        <View className="px-6 pt-2 pb-4">
          <AppText className="text-3xl font-bold text-foreground">
            {subject?.name || t('subject_detail.title')}
          </AppText>
        </View>
        
        <View className="px-6 pb-4">
          <AppText className="text-muted">{t('subject_detail.refresh_note')}</AppText>
        </View>
        
        {quizzes.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <StyledIonicons 
              name="folder-open-outline" 
              size={64} 
              className="text-muted mb-4"
            />
            <AppText className="text-lg font-semibold mb-2">{t('subject_detail.no_questions')}</AppText>
          </View>
        ) : (
          <View className="gap-4 px-6">
            {quizzes.map((quiz, index) => (
              <QuizCard 
                key={quiz.id} 
                {...quiz} 
                index={index}
                onPress={() => router.push(`/quiz/${quiz.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
