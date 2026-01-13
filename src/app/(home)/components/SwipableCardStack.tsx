import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface SwipableCardStackProps {
  data: any[];
  renderCard: (item: any, index: number) => React.ReactNode;
  onSwipeUp?: (item: any) => void;
  onSwipeDown?: (item: any) => void;
}

export const SwipableCardStack: React.FC<SwipableCardStackProps> = ({
  data,
  renderCard,
  onSwipeUp,
  onSwipeDown,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipe = (direction: 'up' | 'down') => {
    const item = data[currentIndex];
    if (direction === 'up' && onSwipeUp) {
      onSwipeUp(item);
    } else if (direction === 'down' && onSwipeDown) {
      onSwipeDown(item);
    }
    
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first card
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateY.value = ctx.startY + event.translationY;
      
      // Scale down slightly while dragging
      const dragScale = interpolate(
        Math.abs(translateY.value),
        [0, SWIPE_THRESHOLD],
        [1, 0.95],
        'clamp'
      );
      scale.value = dragScale;
    },
    onEnd: (event) => {
      const shouldSwipeUp = translateY.value < -SWIPE_THRESHOLD;
      const shouldSwipeDown = translateY.value > SWIPE_THRESHOLD;

      if (shouldSwipeUp) {
        translateY.value = withSpring(-SCREEN_HEIGHT, {}, () => {
          runOnJS(handleSwipe)('up');
          translateY.value = 0;
          scale.value = withTiming(1);
        });
      } else if (shouldSwipeDown) {
        translateY.value = withSpring(SCREEN_HEIGHT, {}, () => {
          runOnJS(handleSwipe)('down');
          translateY.value = 0;
          scale.value = withTiming(1);
        });
      } else {
        translateY.value = withSpring(0);
        scale.value = withTiming(1);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateY.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [-5, 0, 5],
      'clamp'
    );

    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const getStackedCardStyle = (index: number) => {
    const stackOffset = index * 8;
    const stackScale = 1 - index * 0.05;
    
    return {
      position: 'absolute' as const,
      width: '100%',
      top: stackOffset,
      transform: [{ scale: stackScale }],
      zIndex: data.length - index,
      opacity: index < 3 ? 1 : 0, // Show max 3 cards in stack
    };
  };

  const animatedStackedCardStyle = (index: number) =>
    useAnimatedStyle(() => {
      const stackOffset = index * 8;
      const baseScale = 1 - index * 0.05;
      
      // Animate the next card coming forward when current card is swiped
      const nextScale = interpolate(
        Math.abs(translateY.value),
        [0, SWIPE_THRESHOLD],
        [baseScale, Math.min(1, baseScale + 0.05)],
        'clamp'
      );

      return {
        transform: [{ scale: nextScale }],
        top: stackOffset,
      };
    });

  const visibleCards = data.slice(currentIndex, currentIndex + 4);

  return (
    <View style={{ height: 280, position: 'relative' }}>
      {/* Render stacked cards in reverse order (back to front) */}
      {visibleCards.slice(1).reverse().map((item, reverseIndex) => {
        const index = visibleCards.length - 1 - reverseIndex;
        return (
          <Animated.View
            key={`${currentIndex + index}-${item.id}`}
            style={[
              getStackedCardStyle(index),
              animatedStackedCardStyle(index),
            ]}
          >
            {renderCard(item, currentIndex + index)}
          </Animated.View>
        );
      })}

      {/* Top card (swipable) */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{ zIndex: data.length }, animatedCardStyle]}>
          {renderCard(visibleCards[0], currentIndex)}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
