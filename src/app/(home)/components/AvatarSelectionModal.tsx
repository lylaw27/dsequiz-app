import { FC, useState } from 'react';
import { View, Pressable, ScrollView, Modal, Dimensions } from 'react-native';
import { Avatar, Button, cn } from 'heroui-native';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
];

interface AvatarSelectionModalProps {
  visible: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSelect: (avatar: string) => void;
}

export const AvatarSelectionModal: FC<AvatarSelectionModalProps> = ({
  visible,
  currentAvatar,
  onClose,
  onSelect,
}) => {
  const { t } = useLanguage();
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSelect = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View 
          className="bg-surface rounded-t-3xl"
          style={{ maxHeight: SCREEN_HEIGHT * 0.7 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <AppText className="text-xl font-bold text-foreground">
              {t('avatar_modal.title')}
            </AppText>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#666878" />
            </Pressable>
          </View>

          {/* Avatar Grid */}
          <ScrollView className="flex-1 p-6">
            <View className="flex-row flex-wrap gap-4 justify-center">
              {AVATAR_OPTIONS.map((avatar, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedAvatar(avatar)}
                  className={cn(
                    'rounded-full p-1',
                    selectedAvatar === avatar && 'bg-accent'
                  )}
                >
                  <Avatar size="lg" alt={`Avatar ${index + 1}`}>
                    <Avatar.Image source={{ uri: avatar }} />
                    <Avatar.Fallback />
                  </Avatar>
                  {selectedAvatar === avatar && (
                    <View className="absolute bottom-0 right-0 bg-accent rounded-full p-1">
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-6 border-t border-zinc-200 dark:border-zinc-800">
            <Button onPress={handleSelect} className="w-full">
              <Button.Label>{t('avatar_modal.confirm')}</Button.Label>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
