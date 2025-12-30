import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Button, Card, cn } from 'heroui-native';
import type { FC } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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

const quizzes: QuizData[] = [
  {
    id: '1',
    title: 'Integers Quiz',
    quizCount: 10,
    icon: 'function-outline',
    iconColor: '#6366f1',
    iconBgColor: '#e0e7ff',
    peopleJoined: 437,
    avatars: [
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=1',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=2',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
    ],
  },
  {
    id: '2',
    title: 'General Knowledge',
    quizCount: 6,
    icon: 'help-circle-outline',
    iconColor: '#ec4899',
    iconBgColor: '#fce7f3',
    peopleJoined: 437,
    avatars: [
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=4',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=6',
    ],
  },
  {
    id: '3',
    title: 'Statistics Math Quiz',
    quizCount: 12,
    icon: 'bar-chart-outline',
    iconColor: '#6366f1',
    iconBgColor: '#e0e7ff',
    peopleJoined: 437,
    avatars: [
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=7',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=8',
      'https://img.heroui.chat/image/avatar?w=400&h=400&u=9',
    ],
  },
];

type QuizCardProps = QuizData & { index: number };

const QuizCard: FC<QuizCardProps> = ({
  title,
  quizCount,
  icon,
  iconColor,
  iconBgColor,
  peopleJoined,
  avatars,
  index,
}) => {
  const { isDark } = useAppTheme();
  const router = useRouter();

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
      onPress={() => router.push('/quiz-question')}
    >
      <Card
        className={cn(
          'border border-zinc-200 bg-surface',
          isDark && 'border-zinc-800'
        )}
      >
        <View className="gap-4">
          <Card.Body className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="size-14 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: isDark ? iconColor + '33' : iconBgColor,
                  }}
                >
                  <StyledIonicons
                    name={icon as any}
                    size={28}
                    style={{ color: iconColor }}
                  />
                </View>
                <View className="flex-1">
                  <Card.Title className="text-lg mb-1">{title}</Card.Title>
                  <AppText className="text-muted text-sm">
                    {quizCount} Quizzes
                  </AppText>
                </View>
              </View>
              <Button variant="ghost" size="sm">
                <StyledIonicons
                  name="bar-chart-outline"
                  size={18}
                  className="text-primary"
                />
                <Button.Label className="text-primary font-medium">
                  Result
                </Button.Label>
              </Button>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {avatars.map((avatar, idx) => (
                  <View
                    key={idx}
                    className="border-2 border-background rounded-full"
                    style={{ marginLeft: idx > 0 ? -10 : 0 }}
                  >
                    <Avatar size="sm" alt={`Avatar ${idx}`}>
                      <Avatar.Image source={{ uri: avatar }} />
                      <Avatar.Fallback />
                    </Avatar>
                  </View>
                ))}
              </View>
              <AppText className="text-muted text-sm">
                +{peopleJoined} People join
              </AppText>
            </View>
          </Card.Body>
        </View>
      </Card>
    </AnimatedPressable>
  );
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-6 pb-4">
          <AppText className="text-4xl font-bold">Your Quizzes</AppText>
        </View>
        <View className="gap-4 px-5">
          {quizzes.map((quiz, index) => (
            <QuizCard key={quiz.id} {...quiz} index={index} />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton />
      <BottomNavigation />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
