import { StyleSheet, View } from 'react-native';
import { Settings, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { spacing } from '@/theme/tokens';

export function Header({ title, back = false }: { title: string; back?: boolean }) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {back && <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />}
      <AppText variant="title" accessibilityRole="header" style={styles.title}>{title}</AppText>
      {!back && <IconButton icon={Settings} label="Settings" onPress={() => router.push('/settings')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1 },
});
