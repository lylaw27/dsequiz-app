import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, cn } from 'heroui-native';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { SafeAreaView } from '../../../components/safe-area-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

type QuizResult = {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  subject: string;
};

export default function QuizSummaryPage() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    topic: string;
    totalQuestions: string;
    correctCount: string;
    results: string;
  }>();

  const topic = params.topic || 'Quiz';
  const totalQuestions = parseInt(params.totalQuestions || '0', 10);
  const correctCount = parseInt(params.correctCount || '0', 10);
  const results: QuizResult[] = params.results ? JSON.parse(params.results as string) : [];

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const incorrectCount = totalQuestions - correctCount;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColorDark = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <AppText className="text-3xl font-bold flex-1">Quiz Complete!</AppText>
            <Pressable
              onPress={() => router.back()}
              className="size-12 rounded-2xl bg-surface items-center justify-center"
            >
              <StyledFeather name="x" size={24} className="text-foreground" />
            </Pressable>
          </View>
          <AppText className="text-xl text-muted mb-2">{topic}</AppText>
        </View>

        {/* Score Card */}
        <View className="px-5 mb-6">
          <AnimatedPressable
            entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
          >
            <Card className={cn('border border-zinc-200 bg-surface', isDark && 'border-zinc-800')}>
              <Card.Body className="p-6">
                <View className="items-center">
                  <AppText
                    className={cn(
                      'text-6xl font-bold mb-2',
                      isDark ? getScoreColorDark() : getScoreColor()
                    )}
                  >
                    {percentage}%
                  </AppText>
                  <AppText className="text-lg text-muted mb-6">Your Score</AppText>

                  <View className="flex-row gap-8">
                    <View className="items-center">
                      <View
                        className={cn(
                          'size-12 rounded-full items-center justify-center mb-2',
                          'bg-green-100',
                          isDark && 'bg-green-950/40'
                        )}
                      >
                        <StyledFeather
                          name="check"
                          size={24}
                          className={cn('text-green-600', isDark && 'text-green-400')}
                        />
                      </View>
                      <AppText className="text-2xl font-bold">{correctCount}</AppText>
                      <AppText className="text-sm text-muted">Correct</AppText>
                    </View>

                    <View className="items-center">
                      <View
                        className={cn(
                          'size-12 rounded-full items-center justify-center mb-2',
                          'bg-red-100',
                          isDark && 'bg-red-950/40'
                        )}
                      >
                        <StyledFeather
                          name="x"
                          size={24}
                          className={cn('text-red-600', isDark && 'text-red-400')}
                        />
                      </View>
                      <AppText className="text-2xl font-bold">{incorrectCount}</AppText>
                      <AppText className="text-sm text-muted">Incorrect</AppText>
                    </View>

                    <View className="items-center">
                      <View
                        className={cn(
                          'size-12 rounded-full items-center justify-center mb-2',
                          'bg-blue-100',
                          isDark && 'bg-blue-950/40'
                        )}
                      >
                        <StyledFeather
                          name="list"
                          size={24}
                          className={cn('text-blue-600', isDark && 'text-blue-400')}
                        />
                      </View>
                      <AppText className="text-2xl font-bold">{totalQuestions}</AppText>
                      <AppText className="text-sm text-muted">Total</AppText>
                    </View>
                  </View>
                </View>
              </Card.Body>
            </Card>
          </AnimatedPressable>
        </View>

        {/* Results List */}
        <View className="px-5">
          <AppText className="text-xl font-bold mb-4">Question Results</AppText>
          <View className="gap-3">
            {results.map((result, index) => (
              <AnimatedPressable
                key={index}
                entering={FadeInDown.duration(300)
                  .delay(index * 50)
                  .easing(Easing.out(Easing.ease))}
              >
                <Card
                  className={cn(
                    'border-2',
                    result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50',
                    isDark &&
                      (result.isCorrect
                        ? 'bg-green-950/40 border-green-500'
                        : 'bg-red-950/40 border-red-500')
                  )}
                >
                  <Card.Body className="p-4">
                    <View className="flex-row items-start gap-3 mb-3">
                      <StyledFeather
                        name={result.isCorrect ? 'check-circle' : 'x-circle'}
                        size={24}
                        className={cn(
                          result.isCorrect ? 'text-green-600' : 'text-red-600',
                          isDark && (result.isCorrect ? 'text-green-400' : 'text-red-400')
                        )}
                      />
                      <View className="flex-1">
                        <AppText
                          className={cn(
                            'text-sm font-semibold mb-1',
                            result.isCorrect
                              ? isDark
                                ? 'text-green-300'
                                : 'text-green-700'
                              : isDark
                              ? 'text-red-300'
                              : 'text-red-700'
                          )}
                        >
                          Question {result.questionIndex + 1} • {result.subject}
                        </AppText>
                        <AppText
                          className={cn(
                            'text-base mb-2',
                            result.isCorrect
                              ? isDark
                                ? 'text-green-200'
                                : 'text-green-800'
                              : isDark
                              ? 'text-red-200'
                              : 'text-red-800'
                          )}
                        >
                          {result.question}
                        </AppText>
                        {!result.isCorrect && (
                          <View>
                            <AppText
                              className={cn(
                                'text-sm',
                                isDark ? 'text-red-300' : 'text-red-700'
                              )}
                            >
                              Your answer: {result.userAnswer}
                            </AppText>
                            <AppText
                              className={cn(
                                'text-sm font-semibold',
                                isDark ? 'text-red-200' : 'text-red-800'
                              )}
                            >
                              Correct answer: {result.correctAnswer}
                            </AppText>
                          </View>
                        )}
                      </View>
                    </View>
                  </Card.Body>
                </Card>
              </AnimatedPressable>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mt-8 gap-3">
          <AnimatedPressable
            entering={FadeInDown.duration(400)
              .delay(300)
              .easing(Easing.out(Easing.ease))}
          >
            <Button size="lg" variant="primary" onPress={() => router.back()} className="w-full">
              <Button.Label className="text-lg">返回題目列表</Button.Label>
            </Button>
          </AnimatedPressable>
        </View>
      </ScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
