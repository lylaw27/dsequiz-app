import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Chip, cn } from 'heroui-native';
import { useEffect, useState, type FC } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { SafeAreaView } from '../../../components/safe-area-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type MCQ = {
  id: string;
  topic: string;
  question: string;
  subject: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  grade_level: string | null;
  difficulty: number | null;
};

type MCQSetQuestion = {
  order_index: number;
  mcqs: MCQ;
};

type MCQSetDetail = {
  id: string;
  topic: string;
  description: string | null;
  subject: string;
  created_at: string | null;
  updated_at: string | null;
  mcqset_questions: MCQSetQuestion[];
};

type Answer = {
  id: string;
  label: string;
  text: string;
};

type AnswerCardProps = {
  answer: Answer;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  isAnswerConfirmed: boolean;
  correctAnswer: string | null;
};

const AnswerCard: FC<AnswerCardProps> = ({
  answer,
  index,
  isSelected,
  onSelect,
  isAnswerConfirmed,
  correctAnswer,
}) => {
  const { isDark } = useAppTheme();

  const isCorrectAnswer = answer.id === correctAnswer;
  const isWrongSelection = isAnswerConfirmed && isSelected && !isCorrectAnswer;
  const isCorrectSelection = isAnswerConfirmed && isSelected && isCorrectAnswer;
  const showAsCorrect = isAnswerConfirmed && isCorrectAnswer;

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 80)
        .easing(Easing.out(Easing.ease))}
      onPress={onSelect}
    >
      <Card
        className={cn(
          'border-2 bg-surface',
          // After confirmation, show green for correct answer, red for wrong selection
          isWrongSelection && 'border-red-500 bg-red-50',
          isWrongSelection && isDark && 'border-red-500 bg-red-950/20',
          showAsCorrect && 'border-green-500 bg-green-50',
          showAsCorrect && isDark && 'border-green-500 bg-green-950/20',
          // Before confirmation, show primary color for selected
          !isAnswerConfirmed && isSelected && 'border-primary bg-primary/5',
          !isAnswerConfirmed && !isSelected && 'border-zinc-200',
          !isAnswerConfirmed && !isSelected && isDark && 'border-zinc-800'
        )}
      >
        <Card.Body className="p-4">
          <View className="flex-row items-center gap-3">
            <AppText
              className={cn(
                'text-lg font-semibold',
                isSelected ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {answer.label}
            </AppText>
            <AppText
              className={cn(
                'text-lg flex-1',
                isSelected ? 'text-foreground' : 'text-foreground/80'
              )}
            >
              {answer.text}
            </AppText>
            {isAnswerConfirmed && (
              <StyledFeather
                name={showAsCorrect ? 'check-circle' : isWrongSelection ? 'x-circle' : 'circle'}
                size={20}
                className={cn(
                  showAsCorrect && 'text-green-600',
                  showAsCorrect && isDark && 'text-green-400',
                  isWrongSelection && 'text-red-600',
                  isWrongSelection && isDark && 'text-red-400',
                  !showAsCorrect && !isWrongSelection && 'text-transparent'
                )}
              />
            )}
          </View>
        </Card.Body>
      </Card>
    </AnimatedPressable>
  );
};

const ProgressBar: FC<{ progress: number }> = ({ progress }) => {
  const { isDark } = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress * 100}%`, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  return (
    <View
      className={cn(
        'h-2 rounded-full overflow-hidden',
        isDark ? 'bg-zinc-800' : 'bg-zinc-200'
      )}
    >
      <Animated.View
        className="h-full bg-primary rounded-full"
        style={animatedStyle}
      />
    </View>
  );
};

export default function QuizDetailPage() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [mcqSet, setMcqSet] = useState<MCQSetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMCQSet();
    }
  }, [id]);

  const fetchMCQSet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/mcqsets/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const result = await response.json();
      setMcqSet(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching MCQ set:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!mcqSet) return;

    // First click: confirm answer and show result
    if (!isAnswerConfirmed) {
      setIsAnswerConfirmed(true);
      return;
    }

    // Second click: move to next question
    if (currentQuestionIndex < mcqSet.mcqset_questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerConfirmed(false);
    } else {
      // Quiz completed
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <AppText className="text-muted mt-4">Loading quiz...</AppText>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  if (error || !mcqSet) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-5">
          <AppText className="text-lg font-semibold mb-2">Error Loading Quiz</AppText>
          <AppText className="text-muted text-center mb-4">
            {error || 'Quiz not found'}
          </AppText>
          <Button onPress={() => router.back()}>
            <Button.Label>Go Back</Button.Label>
          </Button>
        </View>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  const currentQuestion = mcqSet.mcqset_questions[currentQuestionIndex]?.mcqs;
  const totalQuestions = mcqSet.mcqset_questions.length;
  const currentProgress = (currentQuestionIndex + 1) / totalQuestions;

  // Convert options object to Answer array
  const answers: Answer[] = currentQuestion ? Object.entries(currentQuestion.options).map(([key, value]) => ({
    id: key,
    label: `${key})`,
    text: value as string,
  })) : [];

  const isCorrect = isAnswerConfirmed && selectedAnswer === currentQuestion?.correct_answer;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <AppText className="text-3xl font-bold flex-1">
              {mcqSet.topic}
            </AppText>
            <Pressable
              onPress={() => router.back()}
              className="size-12 rounded-2xl bg-surface items-center justify-center"
            >
              <StyledFeather name="x" size={24} className="text-foreground" />
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between mb-2">
            <AppText className="text-muted text-sm">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </AppText>
          </View>
          <ProgressBar progress={currentProgress} />
        </View>

        {/* Question Card */}
        {currentQuestion && (
          <View className="px-5">
            <AnimatedPressable
              key={currentQuestionIndex}
              entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
            >
              <Card
                className={cn(
                  'border border-zinc-200 bg-surface',
                  isDark && 'border-zinc-800'
                )}
              >
                <Card.Body className="p-5">
                  {/* Category and Difficulty */}
                  <View className="flex-row items-center gap-3 mb-6">
                    <Chip
                      size="md"
                      className={cn(
                        'bg-red-100',
                        isDark && 'bg-red-950/40'
                      )}
                    >
                      <Chip.Label
                        className={cn(
                          'text-red-600',
                          isDark && 'text-red-400'
                        )}
                      >
                        {currentQuestion.subject}
                      </Chip.Label>
                    </Chip>
                    {currentQuestion.difficulty && (
                      <Chip
                        size="md"
                        className={cn(
                          'bg-zinc-100',
                          isDark && 'bg-zinc-800'
                        )}
                      >
                        <Chip.Label className="text-foreground/70">
                          Difficulty: {currentQuestion.difficulty}
                        </Chip.Label>
                      </Chip>
                    )}
                  </View>

                  {/* Question */}
                  <AppText className="text-2xl font-bold text-foreground/90 mb-8">
                    {currentQuestion.question}
                  </AppText>

                  {/* Answers */}
                  <View className="gap-4">
                    {answers.map((answer, index) => (
                      <AnswerCard
                        key={answer.id}
                        answer={answer}
                        index={index}
                        isSelected={selectedAnswer === answer.id}
                        onSelect={() => !isAnswerConfirmed && setSelectedAnswer(answer.id)}
                        isAnswerConfirmed={isAnswerConfirmed}
                        correctAnswer={currentQuestion?.correct_answer || null}
                      />
                    ))}
                  </View>
                </Card.Body>
              </Card>
            </AnimatedPressable>

            {/* Result and Explanation */}
            {isAnswerConfirmed && currentQuestion && (
              <AnimatedPressable
                entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))}
                className="mt-4"
              >
                <Card
                  className={cn(
                    'border-2',
                    isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50',
                    isDark && (isCorrect
                      ? 'bg-green-950/40 border-green-500'
                      : 'bg-red-950/40 border-red-500')
                  )}
                >
                  <Card.Body className="p-5">
                    {/* Result Header */}
                    <View className="flex-row items-center gap-3 mb-4">
                      <StyledFeather
                        name={isCorrect ? 'check-circle' : 'x-circle'}
                        size={28}
                        className={cn(
                          isCorrect ? 'text-green-600' : 'text-red-600',
                          isDark && (isCorrect ? 'text-green-400' : 'text-red-400')
                        )}
                      />
                      <AppText
                        className={cn(
                          'text-2xl font-bold',
                          isCorrect ? 'text-green-600' : 'text-red-600',
                          isDark && (isCorrect ? 'text-green-400' : 'text-red-400')
                        )}
                      >
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </AppText>
                    </View>

                    {/* Correct Answer (if wrong) */}
                    {!isCorrect && (
                      <View className="mb-4">
                        <AppText
                          className={cn(
                            'text-sm font-semibold mb-2',
                            isDark ? 'text-red-300' : 'text-red-700'
                          )}
                        >
                          Correct Answer:
                        </AppText>
                        <AppText
                          className={cn(
                            'text-base',
                            isDark ? 'text-red-200' : 'text-red-800'
                          )}
                        >
                          {currentQuestion.correct_answer}) {currentQuestion.options[currentQuestion.correct_answer]}
                        </AppText>
                      </View>
                    )}

                    {/* Explanation */}
                    <View>
                      <AppText
                        className={cn(
                          'text-sm font-semibold mb-2',
                          isCorrect
                            ? isDark ? 'text-green-300' : 'text-green-700'
                            : isDark ? 'text-red-300' : 'text-red-700'
                        )}
                      >
                        Explanation:
                      </AppText>
                      <AppText
                        className={cn(
                          'text-base leading-6',
                          isCorrect
                            ? isDark ? 'text-green-200' : 'text-green-800'
                            : isDark ? 'text-red-200' : 'text-red-800'
                        )}
                      >
                        {currentQuestion.explanation}
                      </AppText>
                    </View>
                  </Card.Body>
                </Card>
              </AnimatedPressable>
            )}
          </View>
        )}

        {/* Next Button */}
        <View className="px-5 mt-8">
          <AnimatedPressable
            entering={FadeInDown.duration(400)
              .delay(300)
              .easing(Easing.out(Easing.ease))}
          >
            <Button
              size="lg"
              variant="primary"
              disabled={!selectedAnswer}
              onPress={handleNext}
              className={cn(
                'w-full',
                !selectedAnswer && 'opacity-50'
              )}
            >
              <Button.Label className="text-lg">
                {!isAnswerConfirmed
                  ? 'Check Answer'
                  : currentQuestionIndex < totalQuestions - 1
                  ? 'Continue'
                  : 'Finish'}
              </Button.Label>
            </Button>
          </AnimatedPressable>
        </View>
      </ScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
