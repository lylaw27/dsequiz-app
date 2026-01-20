import { View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { useLanguage } from '../../../contexts/language-context';

export function MockScreen() {
  const { t } = useLanguage();
  
  return (
    <View style={{ flex: 1 }} className="bg-background items-center justify-center px-6">
      <AppText className="text-2xl font-bold text-foreground mb-4">
        {t('mock.title')}
      </AppText>
      <AppText className="text-center text-muted">
        {t('mock.coming_soon')}
      </AppText>
    </View>
  );
}
