import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from 'heroui-native';
import react from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import { QuizCard, QuizData } from '../components/QuizCard';
import { Subject, mapSubjectToQuizData } from '../types';
import { SubjectDetailScreen } from './SubjectDetailScreen';

const StyledIonicons = withUniwind(Ionicons);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export function DailyScreen() {
  const { t } = useLanguage();
  const [subjects, setSubjects] = react.useState<QuizData[]>([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = react.useState<string | null>(null);

  react.useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/subjects`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const result = await response.json();
      const subjectsData: Subject[] = result.data || [];
      
      const subjectsWithCount = await Promise.all(
        subjectsData.map(async (subject) => {
          try {
            const countResponse = await fetch(`${API_BASE_URL}/mcqsets?subject_id=${subject.id}`);
            const countResult = await countResponse.json();
            const count = countResult.data?.length || 0;
            
            return mapSubjectToQuizData(subject, count);
          } catch (err) {
            console.error(`Error fetching count for subject ${subject.id}:`, err);
            return mapSubjectToQuizData(subject, 0);
          }
        })
      );
      
      setSubjects(subjectsWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  // If a subject is selected, show the detail screen
  if (selectedSubjectId) {
    return (
      <SubjectDetailScreen 
        subjectId={selectedSubjectId} 
        onBack={() => setSelectedSubjectId(null)} 
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-background px-6">
        <View className="gap-6 pb-28 pt-4">
          <View className="gap-2">
            <AppText className="text-2xl font-bold text-foreground">
              {t('daily.title')}
            </AppText>
            <AppText className="text-base text-muted">
              {t('daily.subtitle')}
            </AppText>
          </View>

          {loading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#007AFF" />
              <AppText className="mt-4 text-muted">{t('daily.loading_subjects')}</AppText>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-12">
              <StyledIonicons
                name="alert-circle-outline"
                size={48}
                className="text-red-500 mb-4"
              />
              <AppText className="text-center text-red-500 mb-4">{error}</AppText>
              <Button onPress={fetchSubjects}>
                {t('common.retry')}
              </Button>
            </View>
          ) : subjects.length > 0 ? (
            <View className="gap-4">
              {subjects.map((subject, index) => (
                <QuizCard 
                  key={subject.id} 
                  {...subject} 
                  index={index} 
                  isSubject={true}
                  onPress={() => setSelectedSubjectId(subject.id)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <StyledIonicons
                name="book-outline"
                size={48}
                className="text-muted mb-4"
              />
              <AppText className="text-center text-muted">{t('daily.no_subjects')}</AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
