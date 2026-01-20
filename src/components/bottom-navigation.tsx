import { FC } from 'react';
import { View, Pressable } from 'react-native';
import { cn } from 'heroui-native';
import { AppText } from './app-text';
import { useAppTheme } from '../contexts/app-theme-context';
import { useLanguage } from '../contexts/language-context';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

interface BottomNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const BottomNavigation: FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isDark } = useAppTheme();
  const { t } = useLanguage();

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-surface',
        isDark && 'border-zinc-800'
      )}
    >
      <View className="flex-row items-center justify-around py-2 px-4">
        <Pressable onPress={() => onTabChange(0)} className="items-center gap-1">
          <View className={cn('py-1 px-4 rounded-full', activeTab === 0 && 'bg-accent')}>
            <MaterialIcons name="home" size={24} color={activeTab === 0 ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', activeTab === 0 ? 'text-foreground/90' : 'text-muted')}>
            {t('navigation.home')}
          </AppText>
        </Pressable>
        <Pressable onPress={() => onTabChange(1)} className="items-center gap-1">
          <View className={cn('py-1 px-4 rounded-full', activeTab === 1 && 'bg-accent')}>
            <MaterialIcons name="pending-actions" size={24} color={activeTab === 1 ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', activeTab === 1 ? 'text-foreground/90' : 'text-muted')}>
            {t('navigation.daily')}
          </AppText>
        </Pressable>
        <Pressable onPress={() => onTabChange(2)} className="items-center gap-1">
          <View className={cn('py-1 px-4 rounded-full', activeTab === 2 && 'bg-accent')}>
            <MaterialIcons name="alarm" size={24} color={activeTab === 2 ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', activeTab === 2 ? 'text-foreground/90' : 'text-muted')}>
            {t('navigation.mock')}
          </AppText>
        </Pressable>
        <Pressable onPress={() => onTabChange(3)} className="items-center gap-1">
          <View className={cn('py-1 px-4 rounded-full', activeTab === 3 && 'bg-accent')}>
            <MaterialIcons name="person-outline" size={24} color={activeTab === 3 ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', activeTab === 3 ? 'text-foreground/90' : 'text-muted')}>
            {t('navigation.profile')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
