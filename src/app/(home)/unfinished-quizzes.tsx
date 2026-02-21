import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { useLanguage } from '../../contexts/language-context';
import { getStoredUserId } from '../../helpers/utils/auth-storage';
import { QuizCard } from './components/QuizCard';

const StyledIonicons = withUniwind(Ionicons);
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function UnfinishedQuizzesScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [unfinishedQuizzes, setUnfinishedQuizzes] = react.useState<any[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);

  const fetchUnfinishedSessions = react.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getStoredUserId();
      const response = await fetch(`${API_BASE_URL}/quiz-sessions/unfinished/${userId || 'null'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch unfinished sessions');
      }

      const result = await response.json();
      const sessions = result.data || [];
      
      // Transform sessions to quiz card format (already ordered by started_at DESC from backend)
      const mappedSessions = sessions.map((session: any) => ({
        id: session.mcqset_id,
        sessionId: session.id,
        category: session.mcqset?.subject?.name || session.mcqset?.subject?.eng_name || 'Quiz',
        title: session.mcqset?.name || 'Untitled Quiz',
        questionCount: session.mcqset?.count || 0,
        answeredCount: session.answered_count || 0,
        difficulty: 'Medium',
        estimatedTime: '15 mins',
        icon: 'document-text-outline',
        progress: session.total_questions > 0 
          ? Math.round((session.answered_count / session.total_questions) * 100)
          : 0,
        startedAt: session.started_at
      }));
      
      setUnfinishedQuizzes(mappedSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching unfinished sessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  react.useEffect(() => {
    fetchUnfinishedSessions();
  }, [fetchUnfinishedSessions]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <AppText className="text-muted mt-4">載入中...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-5">
        <StyledIonicons 
          name="alert-circle-outline" 
          size={64} 
          className="text-muted mb-4"
        />
        <AppText className="text-lg font-semibold mb-2">載入失敗</AppText>
        <AppText className="text-muted text-center mb-4">{error}</AppText>
        <Button onPress={fetchUnfinishedSessions}>
          <Button.Label>{t('common.retry')}</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6 bg-surface">
          <View className="flex-row items-center mb-4">
            <Pressable onPress={() => router.back()} className="mr-3">
              <StyledIonicons name="arrow-back" size={24} className="text-foreground" />
            </Pressable>
            <AppText className="text-3xl font-bold">繼續練習</AppText>
          </View>
          <AppText className="text-muted">
            {unfinishedQuizzes.length} 個未完成的測驗
          </AppText>
        </View>

        {/* Unfinished Quizzes List */}
        <View className="px-5 pt-5">
          {unfinishedQuizzes.length === 0 ? (
            <View className="items-center justify-center py-12">
              <StyledIonicons 
                name="checkmark-circle-outline" 
                size={64} 
                className="text-muted mb-4"
              />
              <AppText className="text-lg font-semibold mb-2">沒有未完成的測驗</AppText>
              <AppText className="text-muted text-center">
                所有測驗都已完成！繼續挑戰新的測驗吧！
              </AppText>
            </View>
          ) : (
            <View className="gap-4">
              {unfinishedQuizzes.map((quiz, index) => (
                <View key={quiz.sessionId}>
                  <QuizCard 
                    {...quiz} 
                    bgColor="bg-surface" 
                    index={index}
                    onPress={() => router.push(`/quiz/${quiz.id}?sessionId=${quiz.sessionId}`)}
                  />
                  {/* Progress indicator */}
                  <View className="px-4 pb-2 bg-surface rounded-b-2xl">
                    <View className="flex-row items-center gap-2">
                      <View className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <View 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${quiz.progress}%` }}
                        />
                      </View>
                      <AppText className="text-xs text-muted">
                        {quiz.answeredCount}/{quiz.questionCount}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
