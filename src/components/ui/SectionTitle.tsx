import type { TextProps } from 'react-native';
import { AppText } from './AppText';

export function SectionTitle({ title, style }: { title: string; style?: TextProps['style'] }) {
  return <AppText variant="heading" accessibilityRole="header" style={style}>{title}</AppText>;
}
