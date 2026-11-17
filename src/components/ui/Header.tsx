import { StyleSheet, View } from 'react-native';
import { Settings, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/provider';

export function Header({ title, back = false, branded = false }: { title: string; back?: boolean; branded?: boolean }) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {back && <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />}
      <View style={styles.title}>
        <AppText variant={branded ? 'display' : 'title'} accessibilityRole="header" accessibilityLabel={title}>{branded ? <>moe<AppText variant="display" tone="primary">math.</AppText></> : title}</AppText>
        {branded && <View style={[styles.signature, { backgroundColor: colors.accent }]} />}
      </View>
      {!back && <IconButton icon={Settings} label="Settings" onPress={() => router.push('/settings')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1 },
  signature: { width: 27, height: 3, marginTop: 3, transform: [{ skewX: '-24deg' }] },
});
