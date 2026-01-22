import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card } from 'heroui-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Sortable from 'react-native-sortables';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledIonicons = withUniwind(Ionicons);

interface Subject {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  order: number;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', icon: '🔢', enabled: true, order: 0 },
  { id: '2', name: 'Chinese', icon: '🇨🇳', enabled: true, order: 1 },
  { id: '3', name: 'English', icon: '🇬🇧', enabled: true, order: 2 },
  { id: '4', name: 'Science', icon: '🔬', enabled: true, order: 3 },
  { id: '5', name: 'History', icon: '📜', enabled: true, order: 4 },
  { id: '6', name: 'Geography', icon: '🌍', enabled: true, order: 5 },
];

export function SubjectSelectionOnboardingScreen({
  onNext,
  onSkip,
}: {
  onNext: (subjects: Subject[]) => void;
  onSkip: () => void;
}) {
  const { isDark } = useAppTheme();
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const removeSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const resetSubjects = () => {
    setSubjects(INITIAL_SUBJECTS);
  };

  // const handleReorder = (nextOrder: string[]) => {
  //   // Reorder subjects based on nextOrder
  //   const reordered = nextOrder
  //     .map(key => subjects.find(s => s.id === key))
  //     .filter((s): s is Subject => s !== undefined)
  //     .map((s, index) => ({
  //       ...s,
  //       order: index,
  //     }));
    
  //   setSubjects(reordered);
  // };

  const handleNext = () => {
    onNext(subjects);
  };

  const renderSubjectCard = (item: Subject) => {
    return (
      <Card className="mb-3">
        <Card.Body className="flex-row items-center gap-4 p-4">
          {/* Drag Handle */}
          <View className="pr-2">
            <StyledIonicons
              name="menu"
              size={24}
              className="text-muted"
            />
          </View>
          
          {/* Subject Icon */}
          <AppText className="text-4xl">{item.icon}</AppText>
          
          {/* Subject Name */}
          <View className="flex-1">
            <AppText className="text-lg font-semibold">{item.name}</AppText>
            <AppText className="text-xs text-muted">
              Priority: #{subjects.indexOf(item) + 1}
            </AppText>
          </View>
          
          {/* Remove Button */}
          <Pressable
            onPress={() => removeSubject(item.id)}
            className="p-2 rounded-full bg-red-500/10"
          >
            <StyledIonicons
              name="close"
              size={20}
              className="text-red-500"
            />
          </Pressable>
        </Card.Body>
      </Card>
    );
  };

  const subjectCount = subjects.length;
  const renderItem = useCallback(({ item }: { item: Subject }) => (             
    <View key={item.id}>
      {renderSubjectCard(item)}
    </View>),
    [subjects]
  );

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      {/* Skip Button */}
      <View className="absolute right-5 top-12 z-10">
        <Pressable onPress={onSkip}>
          <AppText className="text-base font-medium text-primary">Skip</AppText>
        </Pressable>
      </View>

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
            Remove subjects you don't need
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
        <Sortable.Grid columns={1} 
          // onChangeOrder={handleReorder} 
          data={subjects}
          renderItem={renderItem}
          rowGap={10}
          overDrag={'none'}
          dragActivationDelay={0}
        />

        {/* Empty State */}
        {subjectCount === 0 && (
          <View className="items-center justify-center py-12">
            <StyledIonicons name="school-outline" size={64} className="text-muted mb-4" />
            <AppText className="text-lg font-semibold mb-2">No Subjects</AppText>
            <AppText className="text-muted text-center mb-4">
              You've removed all subjects. Tap reset to start over.
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
            onPress={onNext}
            className="h-17 w-17 rounded-full bg-accent"
          >
          <Button.Label className="text-4xl text-white flex items-center justify-center">
            {/* <FontAwesome5 name="arrow-right" size={30} color="white" /> */}
            <Feather name="arrow-right" size={40} color="white" />
          </Button.Label>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}
