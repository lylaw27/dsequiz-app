import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Card, cn } from 'heroui-native';
import react from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    FadeInDown,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useAppTheme } from '../../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledIonicons = withUniwind(Ionicons);

export type QuizData = {
  id: string;
  title: string;
  quizCount: number;
  icon: string;
  iconColor: string;
  bgColor: string;
  peopleJoined: number;
  avatars: string[];
};

export type QuizCardProps = QuizData & { 
  index: number;
  isSubject?: boolean;
  onPress?: () => void;
};

export const QuizCard: react.FC<QuizCardProps> = ({
  id,
  title,
  quizCount,
  icon,
  iconColor,
  bgColor,
  peopleJoined,
  avatars,
  index,
  isSubject = false,
  onPress,
}) => {
  const { isDark } = useAppTheme();

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
      onPress={onPress}
    >
      <Card
        className={cn(
            bgColor,
          'border border-zinc-200 p-3',
          isDark && 'border-zinc-800'
        )}
      >
        <View className="gap-4">
          <Card.Body>
            <View className="flex-row items-center justify-between mb-2 border-2 rounded-2xl p-2 border-surface-foreground bg-surface">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="size-14 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: isDark ? iconColor + '33' : bgColor,
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
                    {quizCount} 個{isSubject ? '題組' : '題目'}
                  </AppText>
                </View>
              </View>
              {/* <Button variant="ghost" size="sm">
                <StyledIonicons
                  name="bar-chart-outline"
                  size={18}
                  className="text-primary"
                />
                <Button.Label className="text-primary font-medium">
                  Result
                </Button.Label>
              </Button> */}
              {/* Timer */}
              <View>

                <View className='flex-row items-center gap-1'>
                  {/* <View className='w-6 h-6'> */}
                    {/* <LottieView
                      autoPlay
                      loop
                      speed={2}
                      // Find more Lottie files at https://lottiefiles.com/featured
                      source={require('@/assets/timer.json')}
                    /> */}
                    <Ionicons name="time-outline" size={20} color="#666878" />
                  {/* </View> */}
                  {/* <ClockIcon/> */}
                  <AppText className='text-sm text-muted'>5分鐘</AppText>
                </View>
                <AppText className='text-sm text-muted text-right'>
                  難度 3~5級
                </AppText>
              </View>
              
            </View>

            <View className="flex-row items-center gap-3">
              <View className="flex-row">
                {avatars ? avatars.map((avatar, idx) => (
                  <View
                    key={idx}
                    className="border-2 border-background rounded-full"
                    style={{ marginLeft: idx > 0 ? -20 : 0 }}
                  >
                    <Avatar size="sm" alt={`Avatar ${idx}`}>
                      <Avatar.Image source={{ uri: avatar }} />
                      <Avatar.Fallback />
                    </Avatar>
                  </View>
                )):<></>}
              </View>
              <AppText className="text-muted text-sm">
                +{peopleJoined}人 已完成
              </AppText>
            </View>
          </Card.Body>
        </View>
      </Card>
    </AnimatedPressable>
  );
};
