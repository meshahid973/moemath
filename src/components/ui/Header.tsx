import { StyleSheet, View } from 'react-native';
import { Settings, ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { size, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/provider';

export function Header({ title, back = false, branded = false }: { title: string; back?: boolean; branded?: boolean }) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {back && <IconButton icon={ArrowLeft} label="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />}
      <View style={styles.title}>
        {branded && <View style={[styles.mark, { backgroundColor: colors.primary }]} accessible={false}><Plus size={18} color={colors.onPrimary} strokeWidth={2.5} /></View>}
        <AppText variant={branded ? 'brand' : 'title'} accessibilityRole="header" accessibilityLabel={title} style={styles.label}>{branded ? 'MoeMath' : title}</AppText>
      </View>
      {!back && <IconButton icon={Settings} label="Settings" onPress={() => router.push('/settings')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flexShrink: 1 },
  mark: { width: size.brandMark, height: size.brandMark, alignItems: 'center', justifyContent: 'center' },
});
