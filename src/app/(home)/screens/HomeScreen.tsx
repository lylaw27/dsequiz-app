import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, Chip } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import { QuizCard } from '../components/QuizCard';
import { SwipableCardStack } from '../components/SwipableCardStack';
import { mapMCQSetToQuizData, MCQSet } from '../types';

const StyledFeather = withUniwind(Feather);
const StyledIonicons = withUniwind(Ionicons);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const recommendedQuizzes: any[] = [
  {
    id: '1',
    category: 'Math1',
    title: 'Algebra Basics',
    questionCount: 20,
    difficulty: 'Easy',
    estimatedTime: '10 mins',
    icon: 'function-outline',
  },
  {
    id: '2',
    category: 'Chinese2',
    title: 'Algebra Basics',
    questionCount: 15,
    difficulty: 'Hard',
    estimatedTime: '10 mins',
    icon: 'function-outline',
  },
  {
    id: '3',
    category: 'Chinese3',
    title: 'Algebra Basics',
    questionCount: 15,
    difficulty: 'Hard',
    estimatedTime: '10 mins',
    icon: 'function-outline',
  },
  {
    id: '4',
    category: 'Chinese4',
    title: 'Algebra Basics',
    questionCount: 15,
    difficulty: 'Hard',
    estimatedTime: '10 mins',
    icon: 'function-outline',
  },
  {
    id: '5',
    category: 'Chinese5',
    title: 'Algebra Basics',
    questionCount: 15,
    difficulty: 'Hard',
    estimatedTime: '10 mins',
    icon: 'function-outline',
  }
];

export function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [quizzes, setQuizzes] = react.useState<any[]>([]);
  const [unfinishedQuizzes, setUnfinishedQuizzes] = react.useState<any[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);

  const fetchMCQSets = react.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/mcqsets`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch MCQ sets');
      }

      const result = await response.json();
      const mcqSets: MCQSet[] = result.data || [];
      
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
  }, []);

  const fetchUnfinishedSessions = react.useCallback(async () => {
    try {
      // TODO: Replace with actual user_id when auth is implemented
      const userId = null;
      const response = await fetch(`${API_BASE_URL}/quiz-sessions/unfinished/${userId || 'null'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch unfinished sessions');
      }

      const result = await response.json();
      const sessions = result.data || [];
      
      // Transform sessions to quiz card format
      const mappedSessions = sessions.map((session: any) => ({
        id: session.mcqset_id,
        sessionId: session.id,
        category: session.mcqset?.subject?.name || session.mcqset?.subject?.eng_name || 'Quiz',
        title: session.mcqset?.topic || 'Untitled Quiz',
        questionCount: session.mcqset?.count || 0,
        answeredCount: session.answered_count || 0,
        difficulty: 'Medium', // You can add difficulty to the database if needed
        estimatedTime: '15 mins',
        icon: 'document-text-outline',
        progress: session.total_questions > 0 
          ? Math.round((session.answered_count / session.total_questions) * 100)
          : 0
      }));
      
      setUnfinishedQuizzes(mappedSessions);
    } catch (err) {
      console.error('Error fetching unfinished sessions:', err);
      // Don't set error state for unfinished sessions, just log it
    }
  }, []);

  react.useEffect(() => {
    fetchMCQSets();
    fetchUnfinishedSessions();
  }, [fetchMCQSets, fetchUnfinishedSessions]);

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <AppText className="text-muted mt-4">{t('home.loading_quizzes')}</AppText>
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
        <AppText className="text-lg font-semibold mb-2">{t('home.error_loading')}</AppText>
        <AppText className="text-muted text-center mb-4">{error}</AppText>
        <Button onPress={fetchMCQSets}>
          <Button.Label>{t('common.retry')}</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6 bg-surface">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <StyledIonicons name="sunny-outline" size={20} className="text-primary" />
                <AppText className="text-primary text-xs font-semibold tracking-wider">
                  {t('home.good_morning').toUpperCase()}
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
        <View className="px-5 mb-36 bg-surface rounded-b-3xl h-32">
          <View className="flex-row items-center justify-between mb-4">
            <AppText className="text-2xl font-bold">{t('home.hot_quizzes')}</AppText>
          </View>

          {/* Featured Quiz Card Stack */}
          <SwipableCardStack
            autoSwipeInterval={4000}
            data={recommendedQuizzes.slice(0, 5)}
            renderCard={(item) => (
              <Card className="p-0 overflow-hidden rounded-2xl">
                <View className="relative">
                  <View className="absolute inset-0 bg-black/60"/>
                  
                  <Card.Body className="p-4">
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-2">
                        <Chip size="md" className="bg-white">
                          <Chip.Label className="text-red-600 text-xs">
                            {item.category}
                          </Chip.Label>
                        </Chip>
                        <Chip size="md" className="bg-white/90">
                          <Chip.Label className="text-zinc-800 text-xs">
                            {item.estimatedTime}
                          </Chip.Label>
                        </Chip>
                      </View>
                      <Pressable className="size-8 rounded-full bg-white/20 items-center justify-center">
                        <StyledFeather name="x" size={18} className="text-white" />
                      </Pressable>
                    </View>

                    <AppText className="text-white text-2xl font-bold mb-1">
                      {item.title}
                    </AppText>
                    <AppText className="text-white/90 text-sm mb-2">
                      {item.questionCount} Questions
                    </AppText>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Avatar size="sm" alt="User">
                          <Avatar.Image source={{ uri: 'https://img.heroui.chat/image/avatar?w=400&h=400&u=7' }} />
                          <Avatar.Fallback />
                        </Avatar>
                        <View>
                          <AppText className="text-white/70 text-xs">Difficulty</AppText>
                          <AppText className="text-white text-xs">
                            {item.difficulty}
                          </AppText>
                        </View>
                      </View>
                      <Button 
                        size="sm" 
                        className="bg-accent rounded-full"
                        onPress={() => router.push({
                          pathname: '/quiz-question',
                          params: { quizId: item.id }
                        })}
                      >
                        <Button.Label className="text-white text-sm">
                          Start Now
                        </Button.Label>
                      </Button>
                    </View>
                  </Card.Body>
                </View>
              </Card>
            )}
            onSwipeUp={(item) => {
              console.log('Swiped up:', item.title);
            }}
            onSwipeDown={(item) => {
              console.log('Swiped down:', item.title);
            }}
          />
        </View>

        {/* 繼續練習 Section - Only show if there are unfinished quizzes */}
        {unfinishedQuizzes.length > 0 && (
          <View className="px-5 bg-surface rounded-t-3xl py-5">
            <View className="flex-row items-center justify-between mb-4">
              <AppText className="text-2xl font-bold">繼續練習</AppText>
              {unfinishedQuizzes.length > 1 && (
                <Pressable onPress={() => router.push('/unfinished-quizzes')}>
                  <AppText className="text-primary text-base font-medium">{t('home.see_all')}</AppText>
                </Pressable>
              )}
            </View>

            <View className="gap-4">
              {/* Show only the latest unfinished quiz */}
              {unfinishedQuizzes.slice(0, 1).map((quiz, index) => (
                <View key={quiz.sessionId}>
                  <QuizCard 
                    {...quiz} 
                    bgColor="bg-surface-foreground" 
                    index={index}
                    onPress={() => router.push(`/quiz/${quiz.id}?sessionId=${quiz.sessionId}`)}
                  />
                  {/* Progress indicator */}
                  <View className="px-4 pb-2">
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
          </View>
        )}

        {/* 為你推薦 Section */}
        <View className={`px-5 bg-surface py-5 ${unfinishedQuizzes.length === 0 ? 'rounded-t-3xl' : ''}`}>
          <View className="flex-row items-center justify-between mb-4">
            <AppText className="text-2xl font-bold">{t('home.recommended')}</AppText>
            <Pressable>
              <AppText className="text-primary text-base font-medium">{t('home.see_all')}</AppText>
            </Pressable>
          </View>

          <View className="gap-4">
            {quizzes.map((quiz, index) => (
              <QuizCard 
                key={quiz.id} 
                {...quiz} 
                bgColor="bg-surface-foreground" 
                index={index}
                onPress={() => router.push(`/quiz/${quiz.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
