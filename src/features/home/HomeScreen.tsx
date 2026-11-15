import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <Screen>
      <Header title="MoeMath" />
      <Surface style={{ backgroundColor: colors.tint }}>
        <View style={styles.hero}>
          <AppText variant="heading">Daily practice</AppText>
          <AppText tone="muted">10 questions</AppText>
        </View>
        <Button label="Choose practice" onPress={() => router.navigate('/practice')} />
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, paddingVertical: spacing.xl },
});
