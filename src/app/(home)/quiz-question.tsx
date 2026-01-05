import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Chip, cn } from 'heroui-native';
import { useState, type FC } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../components/app-text';
import { SafeAreaView } from '../../components/safe-area-view';
import { useAppTheme } from '../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

type Answer = {
  id: string;
  label: string;
  text: string;
};

type Question = {
  category: string;
  timeLimit: string;
  question: string;
  answers: Answer[];
};

const sampleQuestion: Question = {
  category: 'General Knowledge',
  timeLimit: '2min',
  question: 'What is the capital city of Australia?',
  answers: [
    { id: 'a', label: 'a)', text: 'Sydney' },
    { id: 'b', label: 'b)', text: 'Canberra' },
    { id: 'c', label: 'c)', text: 'Brisbane' },
  ],
};

type AnswerCardProps = {
  answer: Answer;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
};

const AnswerCard: FC<AnswerCardProps> = ({
  answer,
  index,
  isSelected,
  onSelect,
}) => {
  const { isDark } = useAppTheme();

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
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-zinc-200',
          isDark && !isSelected && 'border-zinc-800'
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
          </View>
        </Card.Body>
      </Card>
    </AnimatedPressable>
  );
};

const ProgressBar: FC<{ currentQuestion: number; totalQuestions: number }> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const { isDark } = useAppTheme();

  return (
    <View className="flex-row gap-2">
      {Array.from({ length: totalQuestions }).map((_, index) => {
        const questionNumber = index + 1;
        const isCompleted = questionNumber < currentQuestion;
        const isCurrent = questionNumber === currentQuestion;
        const isUpcoming = questionNumber > currentQuestion;

        return (
          <Animated.View
            key={index}
            entering={FadeInDown.duration(300)
              .delay(index * 40)
              .easing(Easing.out(Easing.ease))}
            className={cn(
              'flex-1 h-2 rounded-full',
              isCurrent && 'bg-primary',
              isCompleted && (isDark ? 'bg-primary/40' : 'bg-primary/30'),
              isUpcoming && (isDark ? 'bg-zinc-800' : 'bg-zinc-200')
            )}
          />
        );
      })}
    </View>
  );
};

export default function QuizQuestionPage() {
  const { isDark } = useAppTheme();
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion] = useState(1); // Current question number (1-indexed)
  const [totalQuestions] = useState(10); // Total number of questions

  const handleNext = () => {
    // Navigate to next question or results
    console.log('Selected answer:', selectedAnswer);
    // For now, just log. You can implement navigation to next question
  };

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
              Saturday Night{'\n'}Quiz
            </AppText>
            <Pressable
              onPress={() => router.back()}
              className="size-12 rounded-2xl bg-surface items-center justify-center"
            >
              <StyledFeather name="x" size={24} className="text-foreground" />
            </Pressable>
          </View>
          <ProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
        </View>

        {/* Question Card */}
        <View className="px-5">
          <AnimatedPressable
            entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
          >
            <Card
              className={cn(
                'border border-zinc-200 bg-surface',
                isDark && 'border-zinc-800'
              )}
            >
              <Card.Body className="p-5">
                {/* Category and Time */}
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
                      {sampleQuestion.category}
                    </Chip.Label>
                  </Chip>
                  <Chip
                    size="md"
                    className={cn(
                      'bg-zinc-100',
                      isDark && 'bg-zinc-800'
                    )}
                  >
                    <Chip.Label className="text-foreground/70">
                      {sampleQuestion.timeLimit}
                    </Chip.Label>
                  </Chip>
                </View>

                {/* Question */}
                <AppText className="text-2xl font-bold text-foreground/90 mb-8">
                  {sampleQuestion.question}
                </AppText>

                {/* Answers */}
                <View className="gap-4">
                  {sampleQuestion.answers.map((answer, index) => (
                    <AnswerCard
                      key={answer.id}
                      answer={answer}
                      index={index}
                      isSelected={selectedAnswer === answer.id}
                      onSelect={() => setSelectedAnswer(answer.id)}
                    />
                  ))}
                </View>
              </Card.Body>
            </Card>
          </AnimatedPressable>
        </View>

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
              <Button.Label className="text-lg">Next</Button.Label>
            </Button>
          </AnimatedPressable>
        </View>
      </ScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
