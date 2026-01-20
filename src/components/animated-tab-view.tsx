import { FC, ReactNode, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface TabViewProps {
  activeIndex: number;
  onIndexChange: (index: number) => void;
  children: ReactNode[];
  swipeable?: boolean;
}

export const AnimatedTabView: FC<TabViewProps> = ({
  activeIndex,
  onIndexChange,
  children,
  swipeable = true,
}) => {
  const translateX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(-activeIndex * SCREEN_WIDTH, {
      damping: 60,
      stiffness: 300,
    });
    offsetX.value = -activeIndex * SCREEN_WIDTH;
  }, [activeIndex, translateX, offsetX]);

  const panGesture = Gesture.Pan()
    .enabled(swipeable)
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const shouldMoveToNext = velocity < -500 || (event.translationX < -SCREEN_WIDTH / 3 && velocity < 0);
      const shouldMoveToPrev = velocity > 500 || (event.translationX > SCREEN_WIDTH / 3 && velocity > 0);

      let newIndex = activeIndex;

      if (shouldMoveToNext && activeIndex < children.length - 1) {
        newIndex = activeIndex + 1;
      } else if (shouldMoveToPrev && activeIndex > 0) {
        newIndex = activeIndex - 1;
      }

      translateX.value = withSpring(-newIndex * SCREEN_WIDTH, {
        damping: 60,
        stiffness: 300,
      });
      offsetX.value = -newIndex * SCREEN_WIDTH;

      if (newIndex !== activeIndex) {
        onIndexChange(newIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: SCREEN_WIDTH * children.length,
            },
            animatedStyle,
          ]}
        >
          {children.map((child, index) => (
            <View key={index} style={{ width: SCREEN_WIDTH, flex: 1 }}>
              {child}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
