import { memo } from 'react';
import { Image } from 'expo-image';
import { useReducedMotion } from 'react-native-reanimated';
import { portraitSources } from './portraitSources';
import type { Expression } from './expressions';

export const hasCompanion = portraitSources.neutral !== undefined;

export const CompanionPortrait = memo(function CompanionPortrait({ expression, size }: {
  expression: Expression;
  size: number;
}) {
  const reducedMotion = useReducedMotion();
  const source = portraitSources[expression] ?? portraitSources.neutral;
  if (source === undefined) return null;
  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={reducedMotion ? 0 : { duration: 150, skipOnCacheHit: 'all' }}
      allowDownscaling
      enforceEarlyResizing
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      cachePolicy={size <= 80 ? "memory" : "none"}
    />
  );
});
