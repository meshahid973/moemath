import { StyleSheet, View } from 'react-native';
import { Settings, ArrowLeft, Plus } from 'lucide-react-native';
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
        {branded && <Plus size={25} color={colors.primary} strokeWidth={2.5} accessibilityElementsHidden />}
        <AppText variant={branded ? 'brand' : 'title'} accessibilityRole="header" accessibilityLabel={title} style={styles.label}>{title}</AppText>
      </View>
      {!back && <IconButton icon={Settings} label="Settings" onPress={() => router.push('/settings')} />}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48 },
  title: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  label: { flexShrink: 1 },
});
