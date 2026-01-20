import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, Card, Chip } from 'heroui-native';
import { AppText } from '../../../components/app-text';
import { OnboardingProgressIndicator } from '../../../components/onboarding-progress-indicator';

interface Subject {
  id: string;
  name: string;
  icon: string;
  capability?: 'beginner' | 'intermediate' | 'advanced';
}

const AVAILABLE_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', icon: '🔢' },
  { id: '2', name: 'Chinese', icon: '🇨🇳' },
  { id: '3', name: 'English', icon: '🇬🇧' },
  { id: '4', name: 'Science', icon: '🔬' },
  { id: '5', name: 'History', icon: '📜' },
  { id: '6', name: 'Geography', icon: '🌍' },
];

export function SubjectSelectionOnboardingScreen({
  onNext,
  onSkip,
}: {
  onNext: (selectedSubjects: Subject[]) => void;
  onSkip: () => void;
}) {
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.id === subject.id);
      if (exists) {
        return prev.filter((s) => s.id !== subject.id);
      }
      return [...prev, subject];
    });
  };

  const setCapability = (
    subjectId: string,
    capability: 'beginner' | 'intermediate' | 'advanced'
  ) => {
    setSelectedSubjects((prev) =>
      prev.map((s) => (s.id === subjectId ? { ...s, capability } : s))
    );
  };

  const handleNext = () => {
    onNext(selectedSubjects);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Skip Button */}
      <View className="absolute right-5 top-12 z-10">
        <Pressable onPress={onSkip}>
          <AppText className="text-base font-medium text-primary">Skip</AppText>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 pt-20" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mb-8">
          <AppText className="text-center text-3xl font-bold">
            Choose Your Subjects
          </AppText>
          <AppText className="mt-2 text-center text-base text-muted">
            Select subjects you want to practice and rank your capability
          </AppText>
        </View>

        {/* Subject Selection */}
        <View className="gap-4">
          {AVAILABLE_SUBJECTS.map((subject) => {
            const isSelected = selectedSubjects.find(
              (s) => s.id === subject.id
            );
            const selectedSubject = selectedSubjects.find(
              (s) => s.id === subject.id
            );

            return (
              <View key={subject.id} className="gap-3">
                <Card
                  className={isSelected ? 'border-2 border-primary' : ''}
                  isPressable
                  onPress={() => toggleSubject(subject)}
                >
                  <Card.Body className="flex-row items-center gap-4 p-4">
                    <AppText className="text-4xl">{subject.icon}</AppText>
                    <AppText className="flex-1 text-lg font-semibold">
                      {subject.name}
                    </AppText>
                    <View
                      className={`h-6 w-6 rounded-full border-2 ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-default-300'
                      }`}
                    >
                      {isSelected && (
                        <AppText className="text-center text-sm text-white">
                          ✓
                        </AppText>
                      )}
                    </View>
                  </Card.Body>
                </Card>

                {/* Capability Selection */}
                {isSelected && (
                  <View className="flex-row gap-2 px-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(
                      (level) => (
                        <Chip
                          key={level}
                          size="md"
                          className={`flex-1 ${
                            selectedSubject?.capability === level
                              ? 'bg-primary'
                              : 'bg-surface'
                          }`}
                          onPress={() => setCapability(subject.id, level)}
                        >
                          <Chip.Label
                            className={`text-center text-xs font-medium capitalize ${
                              selectedSubject?.capability === level
                                ? 'text-white'
                                : 'text-foreground'
                            }`}
                          >
                            {level}
                          </Chip.Label>
                        </Chip>
                      )
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Progress Indicator */}
        <View className="my-12">
          <OnboardingProgressIndicator totalSteps={3} currentStep={1} />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-12 right-5">
        <Button
          size="lg"
          onPress={handleNext}
          isDisabled={selectedSubjects.length === 0}
          className={`h-20 w-20 rounded-full ${
            selectedSubjects.length === 0
              ? 'bg-default-300'
              : 'bg-accent'
          }`}
        >
          <Button.Label className="text-4xl text-white">→</Button.Label>
        </Button>
      </View>
    </View>
  );
}
