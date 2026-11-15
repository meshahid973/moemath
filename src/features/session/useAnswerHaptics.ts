import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { SessionAttempt } from '@/engine/session/session';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';

export function useAnswerHaptics(attempt?: SessionAttempt) {
  const { haptics } = useCompanionSettings();
  useEffect(() => {
    if (!haptics || !attempt || Platform.OS === 'web' || AppState.currentState !== 'active') return;
    const type = attempt.expected === attempt.submitted
      ? Haptics.NotificationFeedbackType.Success
      : Haptics.NotificationFeedbackType.Warning;
    void Haptics.notificationAsync(type).catch(() => {});
  }, [attempt, haptics]);
}
