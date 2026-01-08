import { FC, useCallback, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Canvas, Path, Skia, TouchInfo, useTouchHandler } from '@shopify/react-native-skia';
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

type PathWithColor = {
  path: ReturnType<typeof Skia.Path.Make>;
  color: string;
  strokeWidth: number;
};

export const DrawingCanvas: FC<DrawingCanvasProps> = ({ visible, onClose }) => {
  const { isDark } = useAppTheme();
  const [paths, setPaths] = useState<PathWithColor[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#0000FF', // Blue
    '#00FF00', // Green
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
  ];

  const strokeWidths = [1, 3, 5, 8];

  const onTouchHandler = useTouchHandler({
    onStart: (touchInfo: TouchInfo) => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(touchInfo.x, touchInfo.y);
      setPaths((prevPaths) => [
        ...prevPaths,
        { path: newPath, color: currentColor, strokeWidth },
      ]);
    },
    onActive: (touchInfo: TouchInfo) => {
      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths];
        const currentPath = updatedPaths[updatedPaths.length - 1];
        if (currentPath) {
          currentPath.path.lineTo(touchInfo.x, touchInfo.y);
        }
        return updatedPaths;
      });
    },
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
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="pt-12 px-5 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <View className="flex-row items-center justify-between mb-4">
            <AppText className="text-2xl font-bold">Drawing Canvas</AppText>
            <Pressable
              onPress={onClose}
              className="size-10 rounded-xl bg-surface items-center justify-center"
            >
              <StyledFeather name="x" size={20} className="text-foreground" />
            </Pressable>
          </View>

          {/* Color Picker */}
          <View className="mb-3">
            <AppText className="text-sm text-muted mb-2">Color</AppText>
            <View className="flex-row gap-2">
              {colors.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setCurrentColor(color)}
                  className={`size-10 rounded-full ${
                    currentColor === color ? 'border-4 border-primary' : 'border-2 border-zinc-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </View>
          </View>

          {/* Stroke Width Picker */}
          <View className="mb-3">
            <AppText className="text-sm text-muted mb-2">Stroke Width</AppText>
            <View className="flex-row gap-2">
              {strokeWidths.map((width) => (
                <Pressable
                  key={width}
                  onPress={() => setStrokeWidth(width)}
                  className={`size-10 rounded-lg items-center justify-center ${
                    strokeWidth === width
                      ? 'bg-primary'
                      : isDark
                      ? 'bg-zinc-800'
                      : 'bg-zinc-200'
                  }`}
                >
                  <View
                    className="rounded-full bg-foreground"
                    style={{ width: width * 2, height: width * 2 }}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2">
            <Button
              size="sm"
              onPress={handleUndo}
              disabled={paths.length === 0}
              className="flex-1"
            >
              <StyledFeather name="corner-up-left" size={16} className="text-foreground mr-1" />
              <Button.Label>Undo</Button.Label>
            </Button>
            <Button
              size="sm"
              onPress={handleClear}
              disabled={paths.length === 0}
              className="flex-1"
            >
              <StyledFeather name="trash-2" size={16} className="text-foreground mr-1" />
              <Button.Label>Clear</Button.Label>
            </Button>
          </View>
        </View>

        {/* Canvas */}
        <View className="flex-1 bg-white">
          <Canvas style={{ flex: 1 }} onTouch={onTouchHandler}>
            {paths.map((pathData, index) => (
              <Path
                key={index}
                path={pathData.path}
                color={pathData.color}
                style="stroke"
                strokeWidth={pathData.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
          </Canvas>
        </View>
      </View>
    </Modal>
  );
};
