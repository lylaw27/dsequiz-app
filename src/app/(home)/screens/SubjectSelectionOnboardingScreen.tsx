import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card, Switch } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, View, Text } from 'react-native';
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

  const toggleSubjectEnabled = (subjectId: string) => {
    setSubjects((prev) => {
      const updated = prev.map((s) =>
        s.id === subjectId ? { ...s, enabled: !s.enabled } : s
      );
      
      // Sort: enabled subjects first (maintaining their order), disabled subjects last
      const enabledSubjects = updated.filter((s) => s.enabled);
      const disabledSubjects = updated.filter((s) => !s.enabled);
      
      return [...enabledSubjects, ...disabledSubjects].map((s, index) => ({
        ...s,
        order: index,
      }));
    });
  };

  const handleReorder = (nextOrder: string[]) => {
    // Get disabled subjects
    const disabledSubjects = subjects.filter((s) => !s.enabled);
    
    // Reorder enabled subjects based on nextOrder
    const reorderedEnabled = nextOrder
      .map(key => subjects.find(s => s.id === key && s.enabled))
      .filter((s): s is Subject => s !== undefined);
    
    // Combine: enabled subjects in new order, then disabled subjects
    const reordered = [...reorderedEnabled, ...disabledSubjects].map((s, index) => ({
      ...s,
      order: index,
    }));
    
    setSubjects(reordered);
  };

  const handleNext = () => {
    onNext(subjects);
  };

  const renderSubjectCard = (item: Subject) => {
    return (
      <Card
        className={`mb-3 ${!item.enabled ? 'opacity-50' : ''}`}
      >
        <Card.Body className="flex-row items-center gap-4 p-4">
          {/* Drag Handle - only for enabled subjects */}
          {item.enabled && (
            <View className="pr-2">
              <StyledIonicons
                name="menu"
                size={24}
                className="text-muted"
              />
            </View>
          )}
          
          {/* Subject Icon */}
          <AppText className="text-4xl">{item.icon}</AppText>
          
          {/* Subject Name */}
          <View className="flex-1">
            <AppText className="text-lg font-semibold">{item.name}</AppText>
            {item.enabled && (
              <AppText className="text-xs text-muted">
                Priority: #{subjects.filter(s => s.enabled).indexOf(item) + 1}
              </AppText>
            )}
          </View>
          
          {/* Enable/Disable Toggle */}
          <Switch
            value={item.enabled}
            onValueChange={() => toggleSubjectEnabled(item.id)}
          />
        </Card.Body>
      </Card>
    );
  };

  const enabledCount = subjects.filter((s) => s.enabled).length;
  const enabledSubjects = subjects.filter((s) => s.enabled);
  const disabledSubjects = subjects.filter((s) => !s.enabled);

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
            Toggle off subjects youre not learning
          </AppText>
        </View>

        {/* Info Card */}
        <View className="mb-4 rounded-xl bg-primary/10 p-3">
          <View className="flex-row items-center gap-2">
            <StyledIonicons name="information-circle" size={20} className="text-primary" />
            <AppText className="flex-1 text-sm text-primary">
              Drag enabled subjects by the handle to reorder them
            </AppText>
          </View>
        </View>

        {/* Subject Stats */}
        <View className="mb-4 flex-row items-center justify-between rounded-xl bg-surface p-3">
          <AppText className="text-sm font-medium">
            Active Subjects: {enabledCount}
          </AppText>
          <AppText className="text-sm text-muted">
            Disabled: {subjects.length - enabledCount}
          </AppText>
        </View>

        {/* Sortable Subject List */}
        <Sortable.Flex onChangeOrder={handleReorder}>
          {enabledSubjects.map((subject) => (
            <View key={subject.id}>
              {renderSubjectCard(subject)}
            </View>
          ))}
        </Sortable.Flex>

        {/* Disabled Subjects */}
        {disabledSubjects.length > 0 && (
          <View className="mt-4">
            <AppText className="mb-3 text-sm font-semibold text-muted">
              Disabled Subjects
            </AppText>
            {disabledSubjects.map((subject) => (
              <Card key={subject.id} className="mb-3 opacity-50">
                <Card.Body className="flex-row items-center gap-4 p-4">
                  <AppText className="text-4xl">{subject.icon}</AppText>
                  <View className="flex-1">
                    <AppText className="text-lg font-semibold">
                      {subject.name}
                    </AppText>
                  </View>
                  <Switch
                    value={subject.enabled}
                    onValueChange={() => toggleSubjectEnabled(subject.id)}
                  />
                </Card.Body>
              </Card>
            ))}
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
          size="lg"
          onPress={handleNext}
          isDisabled={enabledCount === 0}
          className={`h-20 w-20 rounded-full ${
            enabledCount === 0 ? 'bg-default-300' : 'bg-accent'
          }`}
        >
          <Button.Label className="text-4xl text-white">→</Button.Label>
        </Button>
      </View>
    </GestureHandlerRootView>
  );
}
