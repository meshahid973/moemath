import { ArrowUpRight } from 'lucide-react-native';
import { type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { Button as NativeButton, StatefulButton } from '@/components/button';
import { useTheme } from '@/theme/provider';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  arrow?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Thin product adapter. Press animation, accessibility and loading behavior
// come from the installed upstream beUI Native components.
export function Button({
  label, disabled = false, loading = false, variant = 'primary', arrow = false,
  style, accessibilityState, ...props
}: Props) {
  const { colors } = useTheme();
  const nativeVariant = variant === 'primary' ? 'primary' : 'ghost';
  const appearance: ViewStyle = {
    borderRadius: 10,
    minHeight: 50,
    backgroundColor: variant === 'primary' ? colors.primary : 'transparent',
    borderColor: variant === 'primary' ? colors.primary : 'transparent',
  };
  const common = {
    ...props,
    size: 'lg' as const,
    variant: nativeVariant,
    pressScale: 0.985,
    className: 'self-stretch',
    style: [appearance, style],
    disabled: disabled || loading,
    accessibilityState: { ...accessibilityState, busy: loading, disabled: disabled || loading },
  };
  return loading ? (
    <StatefulButton
      {...common}
      disabled={disabled}
      state="loading"
      loadingText="Working"
      icon={arrow ? ArrowUpRight : undefined}
    >{label}</StatefulButton>
  ) : (
    <NativeButton {...common} endIcon={arrow ? ArrowUpRight : undefined}>
      {label}
    </NativeButton>
  );
}
