import { Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { radius, size } from '@/theme/tokens';

type Props = { icon: LucideIcon; label: string; onPress: () => void; disabled?: boolean };

export function IconButton({ icon: Icon, label, onPress, disabled = false }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.tint : colors.surface, opacity: disabled ? 0.5 : 1 }]}>
      <Icon size={size.icon} color={colors.text} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: size.touch, height: size.touch, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center' },
});
