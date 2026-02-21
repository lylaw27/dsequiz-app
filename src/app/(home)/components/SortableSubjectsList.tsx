import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from 'heroui-native';
import { FC, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import Sortable from 'react-native-sortables';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';

const StyledIonicons = withUniwind(Ionicons);

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

interface SortableSubjectsListProps {
  subjects: Subject[];
  onRemoveSubject: (subjectId: string) => void;
  onDragEnd: (params: { data: Subject[] }) => void;
}

export const SortableSubjectsList: FC<SortableSubjectsListProps> = ({
  subjects,
  onRemoveSubject,
  onDragEnd,
}) => {
  const enabledSubjects = subjects.filter(s => s.enabled);

  const renderSubjectCard = useCallback((item: Subject) => {
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
              Priority: #{enabledSubjects.indexOf(item) + 1}
            </AppText>
          </View>
          
          {/* Remove Button */}
          <Pressable
            onPress={() => onRemoveSubject(item.id)}
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
  }, [enabledSubjects, onRemoveSubject]);

  const renderItem = useCallback(
    ({ item }: { item: Subject }) => (
      <View key={item.id}>
        {renderSubjectCard(item)}
      </View>
    ),
    [renderSubjectCard]
  );

  return (
    <Sortable.Grid
      columns={1}
      onDragEnd={onDragEnd}
      data={enabledSubjects}
      renderItem={renderItem}
      rowGap={10}
      overDrag={'none'}
      dragActivationDelay={0}
    />
  );
};
