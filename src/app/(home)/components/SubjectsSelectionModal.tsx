import { FC, useState, useEffect, useCallback } from 'react';
import { View, Pressable, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Button, Card, cn } from 'heroui-native';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { withUniwind } from 'uniwind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getStoredUserId } from '../../../helpers/utils/auth-storage';
import { SortableSubjectsList } from './SortableSubjectsList';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const StyledIonicons = withUniwind(Ionicons);

// Icon mapping for subjects
const SUBJECT_ICONS: Record<string, string> = {
  'Mathematics': '🔢',
  '數學': '🔢',
  'Chinese': '🇨🇳',
  'DSE中文12篇範文': '📚',
  'English': '🇬🇧',
  'Science': '🔬',
  'History': '📜',
  '中國歷史': '🏛️',
  'Geography': '🌍',
  'Chemistry': '⚗️',
  '化學': '⚗️',
  'BAFS': '💼',
  '企業、會計與財務概論': '💼',
};

interface Subject {
  id: string;
  name: string;
  eng_name?: string;
  icon?: string;
  enabled: boolean;
  order: number;
  description?: string;
  image_url?: string;
}

interface SubjectsSelectionModalProps {
  visible: boolean;
  selectedSubjects: Subject[];
  onClose: () => void;
  onSelect: (subjects: Subject[]) => void;
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

  useEffect(() => {
    if (visible) {
      fetchSubjectsWithPreferences();
    }
  }, [visible]);

  const fetchSubjectsWithPreferences = async () => {
    try {
      setLoading(true);
      const userId = await getStoredUserId();
      const response = await fetch(`${API_BASE_URL}/subjects-with-preferences/${userId || 'null'}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const result = await response.json();
      
      // Transform API data to match our Subject interface
      const transformedSubjects: Subject[] = result.data.map((subject: any) => ({
        id: subject.id,
        name: subject.name,
        eng_name: subject.eng_name,
        icon: SUBJECT_ICONS[subject.name] || SUBJECT_ICONS[subject.eng_name] || '📖',
        enabled: subject.enabled,
        order: subject.order,
        description: subject.description,
        image_url: subject.image_url,
      }));

      setSubjects(transformedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const removeSubject = useCallback((subjectId: string) => {
    setSubjects((prev) => prev.map(s => 
      s.id === subjectId ? { ...s, enabled: false } : s
    ));
  }, []);

  const resetSubjects = () => {
    fetchSubjectsWithPreferences();
  };

  const handleConfirm = async () => {
    try {
      // Save to backend
      const userId = await getStoredUserId();
      console.log('Saving subject preferences for user:', subjects);
      const response = await fetch(`${API_BASE_URL}/user-subject-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          subjects: subjects.map((s) => ({
            id: s.id,
            enabled: s.enabled,
            order: s.order,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Pass subjects back to parent
      onSelect(subjects);
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still close modal and update local state
      onSelect(subjects);
      onClose();
    }
  };

  const enabledSubjects = subjects.filter(s => s.enabled);
  const subjectCount = enabledSubjects.length;
  
  const handleDragEnd = useCallback((params: { data: Subject[] }) => {
    console.log('onDragEnd triggered');
    console.log('Current subjects state:', subjects);
    console.log('Reordered data from event:', params.data);
    
    // Update the order of all subjects based on the new sorted data
    const updatedSubjects = subjects.map(subject => {
      const newIndex = params.data.findIndex(s => s.id === subject.id);
      if (newIndex !== -1) {
        return { ...subject, order: newIndex };
      }
      return subject;
    });
    
    console.log('Updated subjects with new order:', updatedSubjects);
    setSubjects(updatedSubjects);
  }, [subjects]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <GestureHandlerRootView className="flex-1">
          <View 
            className="bg-surface rounded-t-3xl mt-20"
            style={{ flex: 1 }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <AppText className="text-xl font-bold text-foreground">
                {t('subjects_modal.title') || 'My Subjects'}
              </AppText>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color="#666878" />
              </Pressable>
            </View>

            {/* Instructions */}
            <View className="px-6 pt-4">
              <AppText className="text-center text-base text-muted">
                Drag to reorder by preference
              </AppText>
              <AppText className="text-center text-sm text-muted mt-1">
                Remove subjects you don&apos;t need
              </AppText>
            </View>

            {/* Subjects List */}
            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
              {loading ? (
                <View className="items-center justify-center py-12">
                  <ActivityIndicator size="large" color="#007AFF" />
                  <AppText className="text-muted mt-4">Loading subjects...</AppText>
                </View>
              ) : (
                <View>
                  {/* Action Buttons Row */}
                  <View className="mb-4 flex-row items-center gap-3">
                    {/* Info Card */}
                    <View className="flex-1 rounded-xl bg-primary/10 p-3">
                      <View className="flex-row items-center gap-2">
                        <StyledIonicons name="information-circle" size={20} className="text-primary" />
                        <AppText className="flex-1 text-sm text-primary">
                          Drag cards to reorder
                        </AppText>
                      </View>
                    </View>

                    {/* Reset Button */}
                    <Pressable
                      onPress={resetSubjects}
                      className="rounded-xl bg-surface p-3 border border-zinc-200"
                    >
                      <View className="flex-row items-center gap-2">
                        <StyledIonicons name="refresh" size={20} className="text-foreground" />
                        <AppText className="text-sm font-medium">Reset</AppText>
                      </View>
                    </Pressable>
                  </View>

                  {/* Subject Stats */}
                  <View className="mb-4 rounded-xl bg-surface p-3">
                    <AppText className="text-sm font-medium text-center">
                      {subjectCount} Subject{subjectCount !== 1 ? 's' : ''} Selected
                    </AppText>
                  </View>

                  {/* Sortable Subject List */}
                  <SortableSubjectsList
                    subjects={subjects}
                    onRemoveSubject={removeSubject}
                    onDragEnd={handleDragEnd}
                  />

                  {/* Empty State */}
                  {subjectCount === 0 && (
                    <View className="items-center justify-center py-12">
                      <StyledIonicons name="school-outline" size={64} className="text-muted mb-4" />
                      <AppText className="text-lg font-semibold mb-2">No Subjects</AppText>
                      <AppText className="text-muted text-center mb-4">
                        You&apos;ve removed all subjects. Tap reset to start over.
                      </AppText>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View className="p-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button onPress={handleConfirm} className="w-full" isDisabled={subjectCount === 0}>
                <Button.Label>{t('subjects_modal.confirm') || 'Save Changes'}</Button.Label>
              </Button>
            </View>
          </View>
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
};
