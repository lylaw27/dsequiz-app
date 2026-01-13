import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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
  const bottomCardProgress = useSharedValue(0);
  const startY = useSharedValue(0);
  const offsetGap = 22;
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

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = startY.value + event.translationY;
      
      // Control the animation progress for the bottom card coming up
      const progress = interpolate(
        Math.abs(translateY.value),
        [0, SWIPE_THRESHOLD],
        [0, 1],
        'clamp'
      );
      bottomCardProgress.value = progress;
    })
    .onEnd(() => {
      const shouldSwipeUp = translateY.value < -SWIPE_THRESHOLD;
      const shouldSwipeDown = translateY.value > SWIPE_THRESHOLD;

      if (shouldSwipeUp || shouldSwipeDown) {
        // Animate bottom card to overlay position
        bottomCardProgress.value = withTiming(1, { duration: 300 }, () => {
          runOnJS(handleSwipe)(shouldSwipeUp ? 'up' : 'down');
          translateY.value = 0;
          bottomCardProgress.value = 0;
        });
      } else {
        translateY.value = withSpring(0);
        bottomCardProgress.value = withTiming(0);
      }
    });

  const animatedTopCardStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [1, 0],
      'clamp'
    );

    const scale = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [1, 0.95],
      'clamp'
    );

    return {
      opacity,
      transform: [
        { translateY: translateY.value },
        { scale },
      ],
    };
  });

  // Create circular array to always show cards (wraps around)
  const getCardAtIndex = (index: number) => {
    return data[index % data.length];
  };

  // Front card at currentIndex, then next cards (index+1, index+2)
  // These will be shown stacked behind/above the current card
  const visibleCards = Array.from({ length: 3 }, (_, i) => {
    const arrayIndex = (currentIndex + i) % data.length;
    return {
      item: getCardAtIndex(arrayIndex),
      actualIndex: arrayIndex,
      stackIndex: i,
    };
  });

  // Create animated styles for each stacked card
  const animatedStackedCard1Style = useAnimatedStyle(() => {
    const stackOffset = -1 * offsetGap;
    const baseScale = 1 - 1 * 0.05;
    const baseWidth = 0.96; // 96% width
    
    // Card coming to the front
    const nextScale = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [baseScale, 1],
      'clamp'
    );

    const nextTop = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [stackOffset, 0],
      'clamp'
    );

    const nextWidth = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [baseWidth, 1],
      'clamp'
    );

    return {
      transform: [{ scale: nextScale }],
      top: nextTop,
      width: `${nextWidth * 100}%`,
      alignSelf: 'center',
    };
  });

  const animatedStackedCard2Style = useAnimatedStyle(() => {
    const stackOffset = -2 * offsetGap;
    const baseScale = 1 - 2 * 0.05;
    const baseWidth = 0.92; // 92% width
    
    // Other cards move slightly forward
    const nextScale = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [baseScale, Math.min(1, baseScale + 0.05)],
      'clamp'
    );

    const nextTop = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [stackOffset, Math.max(-offsetGap, stackOffset + offsetGap)],
      'clamp'
    );

    const nextWidth = interpolate(
      bottomCardProgress.value,
      [0, 1],
      [baseWidth, 0.96],
      'clamp'
    );

    return {
      transform: [{ scale: nextScale }],
      top: nextTop,
      width: `${nextWidth * 100}%`,
      alignSelf: 'center',
    };
  });

  const getAnimatedStyle = (index: number) => {
    switch (index) {
      case 1: return animatedStackedCard1Style;
      case 2: return animatedStackedCard2Style;
      default: return {};
    }
  };

  const getStackedCardStyle = (index: number) => {
    return {
      position: 'absolute' as const,
      zIndex: 10 - index,
    };
  };

  return (
    <View style={{ height: 200, position: 'relative', alignItems: 'center',top : 30 }}>
      {/* Render stacked cards behind (cards 3, 2, 1 from back to front) */}
      {visibleCards.slice(1).reverse().map((cardData) => {
        const stackIndex = cardData.stackIndex;
        return (
          <Animated.View
            key={`stacked-${cardData.actualIndex}-${stackIndex}`}
            style={[
              getStackedCardStyle(stackIndex),
              getAnimatedStyle(stackIndex),
            ]}
          >
            {renderCard(cardData.item, cardData.actualIndex)}
          </Animated.View>
        );
      })}

      {/* Top card (swipable) - highest z-index, front-most */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ zIndex: 100, width: '100%' }, animatedTopCardStyle]}>
          {renderCard(visibleCards[0].item, visibleCards[0].actualIndex)}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
