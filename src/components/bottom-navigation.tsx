import Ionicons from '@expo/vector-icons/Ionicons';
import { FC, useState } from 'react';
import { View, Pressable } from 'react-native';
import { withUniwind } from 'uniwind';
import { cn } from 'heroui-native';
import { AppText } from './app-text';
import { useAppTheme } from '../contexts/app-theme-context';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

const StyledIonicons = withUniwind(Ionicons);

export const BottomNavigation: FC = () => {
  const { isDark } = useAppTheme();
  const [selectedTab, setSelectedTab] = useState<'home' | 'daily' | 'mock' | 'profile'>('daily');

  return (
    <View
      className={cn(
        'absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-surface',
        isDark && 'border-zinc-800'
      )}
    >
      <View className="flex-row items-center justify-around py-3 px-4">
        <Pressable onPress={() => setSelectedTab('home')} className="items-center gap-1">
          <View className={cn('py-2 px-4 rounded-full', selectedTab === 'home' && 'bg-accent')}>
            <MaterialIcons name="home" size={24} color={selectedTab === 'home' ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', selectedTab === 'home' ? 'text-foreground/90' : 'text-muted')}>
            主頁
          </AppText>
        </Pressable>
        <Pressable onPress={() => setSelectedTab('daily')} className="items-center gap-1">
          <View className={cn('py-2 px-4 rounded-full', selectedTab === 'daily' && 'bg-accent')}>
            <MaterialIcons name="pending-actions" size={24} color={selectedTab === 'daily' ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', selectedTab === 'daily' ? 'text-foreground/90' : 'text-muted')}>
            是日題目
          </AppText>
        </Pressable>
        <Pressable onPress={() => setSelectedTab('mock')} className="items-center gap-1">
          <View className={cn('py-2 px-4 rounded-full', selectedTab === 'mock' && 'bg-accent')}>
            <MaterialIcons name="alarm" size={24} color={selectedTab === 'mock' ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', selectedTab === 'mock' ? 'text-foreground/90' : 'text-muted')}>
            模擬試題
          </AppText>
        </Pressable>
        <Pressable onPress={() => setSelectedTab('profile')} className="items-center gap-1">
          <View className={cn('py-2 px-4 rounded-full', selectedTab === 'profile' && 'bg-accent')}>
            <MaterialIcons name="person-outline" size={24} color={selectedTab === 'profile' ? '#FFFFFF' : '#666878'} />
          </View>
          <AppText className={cn('text-xs', selectedTab === 'profile' ? 'text-foreground/90' : 'text-muted')}>
            個人設置
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};
