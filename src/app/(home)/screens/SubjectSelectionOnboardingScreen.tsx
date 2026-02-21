import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'heroui-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';
import { SortableSubjectsList } from '../components/SortableSubjectsList';

const StyledIonicons = withUniwind(Ionicons);

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

export function SubjectSelectionOnboardingScreen({
  onNext,
}: {
  onNext: (subjects: Subject[]) => void;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects from API
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/subjects`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const result = await response.json();
      
      // Transform API data to match our Subject interface
      const transformedSubjects: Subject[] = result.data.map((subject: any, index: number) => ({
        id: subject.id,
        name: subject.name,
        eng_name: subject.eng_name,
        icon: SUBJECT_ICONS[subject.name] || SUBJECT_ICONS[subject.eng_name] || '📖',
        enabled: true,
        order: index,
        description: subject.description,
        image_url: subject.image_url,
      }));

      setSubjects(transformedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Set empty array on error so UI can still show
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
    fetchSubjects();
  };

  const handleDragEnd = useCallback((params: { data: Subject[] }) => {
    // Update the order of all subjects based on the new sorted data
    const updatedSubjects = subjects.map(subject => {
      const newIndex = params.data.findIndex(s => s.id === subject.id);
      if (newIndex !== -1) {
        return { ...subject, order: newIndex };
      }
      return subject;
    });
    
    setSubjects(updatedSubjects);
  }, [subjects]);

  const handleNext = () => {
    // Just pass subjects to parent, don't save yet
    onNext(subjects);
  };

  const enabledSubjects = subjects.filter(s => s.enabled);
  const subjectCount = enabledSubjects.length;

  // Show loading state
  if (loading) {
    return (
      <GestureHandlerRootView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <AppText className="text-muted mt-4">Loading subjects...</AppText>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      {/* Content */}
      <ScrollView className="flex-1 px-5 pt-20" contentContainerStyle={{ paddingBottom: 200 }}>
        <View className="mb-6">
          <AppText className="text-center text-3xl font-bold">
            Organize Your Subjects
          </AppText>
          <AppText className="mt-2 text-center text-base text-muted">
            Drag to reorder by preference (strongest to weakest)
          </AppText>
          <AppText className="mt-1 text-center text-sm text-muted">
            Remove subjects you don&apos;t need
          </AppText>
        </View>

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

        {/* Progress Indicator */}
        <View className="my-6">
          <OnboardingProgressIndicator totalSteps={3} currentStep={1} />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-12 right-5">
        <Button
            size="sm"
            onPress={handleNext}
            isDisabled={subjectCount === 0}
            className="h-17 w-17 rounded-full bg-accent"
          >
          <Button.Label className="text-4xl text-white flex items-center justify-center">
            <Feather name="arrow-right" size={40} color="white" />
          </Button.Label>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}
