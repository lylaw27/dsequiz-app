import { FC, useState, useEffect } from 'react';
import { View, Pressable, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Button, cn } from 'heroui-native';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { withUniwind } from 'uniwind';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const StyledIonicons = withUniwind(Ionicons);

interface Subject {
  id: string;
  name: string;
  icon?: string;
  iconColor?: string;
}

interface SubjectsSelectionModalProps {
  visible: boolean;
  selectedSubjects: string[];
  onClose: () => void;
  onSelect: (subjectIds: string[]) => void;
}

export const SubjectsSelectionModal: FC<SubjectsSelectionModalProps> = ({
  visible,
  selectedSubjects,
  onClose,
  onSelect,
}) => {
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(selectedSubjects);

  useEffect(() => {
    if (visible) {
      fetchSubjects();
      setSelected(selectedSubjects);
    }
  }, [visible, selectedSubjects]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/subjects`);
      if (!response.ok) throw new Error('Failed to fetch subjects');
      
      const result = await response.json();
      setSubjects(result.data || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setSelected(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleConfirm = () => {
    onSelect(selected);
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
              {t('subjects_modal.title')}
            </AppText>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#666878" />
            </Pressable>
          </View>

          {/* Subjects List */}
          <ScrollView className="flex-1 p-6">
            {loading ? (
              <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : (
              <View className="gap-3">
                {subjects.map((subject) => (
                  <Pressable
                    key={subject.id}
                    onPress={() => toggleSubject(subject.id)}
                    className={cn(
                      'flex-row items-center justify-between p-4 rounded-2xl border-2',
                      selected.includes(subject.id)
                        ? 'bg-accent/10 border-accent'
                        : 'bg-background border-zinc-200 dark:border-zinc-800'
                    )}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      {subject.icon && (
                        <View
                          className="size-10 rounded-xl items-center justify-center"
                          style={{ backgroundColor: subject.iconColor + '33' }}
                        >
                          <StyledIonicons
                            name={subject.icon as any}
                            size={20}
                            style={{ color: subject.iconColor || '#007AFF' }}
                          />
                        </View>
                      )}
                      <AppText className={cn(
                        'text-base font-medium',
                        selected.includes(subject.id) ? 'text-accent' : 'text-foreground'
                      )}>
                        {subject.name}
                      </AppText>
                    </View>
                    {selected.includes(subject.id) && (
                      <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="p-6 border-t border-zinc-200 dark:border-zinc-800">
            <View className="mb-3">
              <AppText className="text-sm text-muted text-center">
                {t('subjects_modal.selected_count', { count: selected.length })}
              </AppText>
            </View>
            <Button onPress={handleConfirm} className="w-full">
              <Button.Label>{t('subjects_modal.confirm')}</Button.Label>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
