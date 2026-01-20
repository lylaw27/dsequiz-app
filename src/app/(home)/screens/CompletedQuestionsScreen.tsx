import Ionicons from '@expo/vector-icons/Ionicons';
import { View, ScrollView, Pressable } from 'react-native';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';
import { QuizCard } from '../components/QuizCard';

const StyledIonicons = withUniwind(Ionicons);

// Placeholder data - will be replaced with actual user data later
const PLACEHOLDER_COMPLETED_QUIZZES = [
  {
    id: '1',
    title: '中國語文 - 文言文',
    quizCount: 20,
    icon: 'book-outline',
    iconColor: '#FF6B6B',
    bgColor: 'bg-red-50',
    peopleJoined: 156,
    avatars: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    ],
  },
  {
    id: '2',
    title: '數學 - 代數',
    quizCount: 15,
    icon: 'calculator-outline',
    iconColor: '#4ECDC4',
    bgColor: 'bg-teal-50',
    peopleJoined: 203,
    avatars: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    ],
  },
  {
    id: '3',
    title: '英語 - 閱讀理解',
    quizCount: 25,
    icon: 'language-outline',
    iconColor: '#95E1D3',
    bgColor: 'bg-green-50',
    peopleJoined: 189,
    avatars: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    ],
  },
];

interface CompletedQuestionsScreenProps {
  onBack: () => void;
}

export function CompletedQuestionsScreen({ onBack }: CompletedQuestionsScreenProps) {
  const { t } = useLanguage();
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Back button */}
        <View className="px-6 pt-4 pb-2">
          <Pressable 
            onPress={onBack}
            className="flex-row items-center gap-2"
          >
            <StyledIonicons 
              name="arrow-back" 
              size={24} 
              className="text-foreground"
            />
            <AppText className="text-base">{t('common.back')}</AppText>
          </Pressable>
        </View>
        
        {/* Header */}
        <View className="px-6 pt-2 pb-4">
          <AppText className="text-3xl font-bold text-foreground">
            {t('completed_questions.title')}
          </AppText>
          <AppText className="text-muted mt-2">
            {t('completed_questions.subtitle')} {PLACEHOLDER_COMPLETED_QUIZZES.length} {t('completed_questions.quizzes')}
          </AppText>
        </View>
        
        {/* Completed Quizzes */}
        {PLACEHOLDER_COMPLETED_QUIZZES.length === 0 ? (
          <View className="items-center justify-center px-6 py-12">
            <StyledIonicons 
              name="checkmark-done-circle-outline" 
              size={64} 
              className="text-muted mb-4"
            />
            <AppText className="text-lg font-semibold mb-2">{t('completed_questions.no_completed')}</AppText>
            <AppText className="text-muted text-center">
              {t('completed_questions.no_completed_subtitle')}
            </AppText>
          </View>
        ) : (
          <View className="gap-4 px-6">
            {PLACEHOLDER_COMPLETED_QUIZZES.map((quiz, index) => (
              <QuizCard 
                key={quiz.id} 
                {...quiz} 
                index={index}
                onPress={() => console.log('View quiz results:', quiz.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
