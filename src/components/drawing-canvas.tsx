import { FC, useCallback, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Button } from 'heroui-native';
import Feather from '@expo/vector-icons/Feather';
import { withUniwind } from 'uniwind';
import { AppText } from './app-text';
import { useAppTheme } from '../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

type DrawingCanvasProps = {
  visible: boolean;
  onClose: () => void;
};

type PathData = {
  path: string;
  color: string;
  strokeWidth: number;
};

export const DrawingCanvas: FC<DrawingCanvasProps> = ({ visible, onClose }) => {
  const { isDark } = useAppTheme();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  
  const strokeColor = '#000000';
  const strokeWidth = 3;

  const pan = Gesture.Pan()
    .onStart((e) => {
      setCurrentPath(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      setCurrentPath((prevPath) => `${prevPath} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      if (currentPath) {
        setPaths((prevPaths) => [
          ...prevPaths,
          { path: currentPath, color: strokeColor, strokeWidth },
        ]);
        setCurrentPath('');
      }
    });

  const handleClear = useCallback(() => {
    setPaths([]);
  }, []);

  const handleUndo = useCallback(() => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-5">
        <View className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden" style={{ height: '90%' }}>
          {/* Header */}
          <View className="pt-6 px-5 pb-4">
            <View className="flex-row items-center justify-center">
              <AppText className="text-2xl font-bold text-black">草稿</AppText>
              <Pressable
                onPress={onClose}
                className="size-10 rounded-xl bg-zinc-100 items-center justify-center absolute right-0"
              >
                <StyledFeather name="x" size={20} className="text-black" />
              </Pressable>
            </View>
          </View>

        {/* Canvas */}
        <GestureDetector gesture={pan}>
          <View className="flex-1 bg-white">
            <Svg style={{ flex: 1 }}>
              {paths.map((pathData, index) => (
                <Path
                  key={index}
                  d={pathData.path}
                  stroke={pathData.color}
                  strokeWidth={pathData.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath && (
                <Path
                  d={currentPath}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
            </Svg>
          </View>
        </GestureDetector>
        
        {/* Action Buttons */}
        <View className="px-10 py-4">
          <View className="flex-row gap-3">
            <Button
              size="md"
              onPress={handleUndo}
              disabled={paths.length === 0}
              className="flex-1 bg-accent/70"
            >
              <StyledFeather name="corner-up-left" size={15} className="text-surface mr-1" />
              <Button.Label>復原</Button.Label>
            </Button>
            <Button
              size="md"
              onPress={handleClear}
              disabled={paths.length === 0}
              className="flex-1 bg-accent/70"
            >
              <StyledFeather name="trash-2" size={15} className="text-surface mr-1" />
              <Button.Label>清除</Button.Label>
            </Button>
          </View>
        </View>
        </View>
      </View>
    </Modal>
  );
};
