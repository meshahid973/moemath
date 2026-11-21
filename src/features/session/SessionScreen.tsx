import { useCallback, useEffect, useReducer, useRef } from 'react';
import { Alert, AppState, BackHandler, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pause, X } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import type { SessionOptions } from '@/engine/arithmetic/questions';
import { adaptiveQuestions } from '@/engine/adaptive/plan';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';
import { localDay } from '@/engine/progress/metrics';
import { createSeed } from '@/engine/session/options';
import { createSession, sessionReducer } from '@/engine/session/session';
import { spacing } from '@/theme/tokens';
import { Keypad, type Key } from './Keypad';
import { QuestionStage } from './QuestionStage';
import { SessionProgress } from './SessionProgress';
import { SessionResults } from './SessionResults';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { AnswerSounds } from './AnswerSounds';
import { useAnswerHaptics } from './useAnswerHaptics';
import { SessionTimer } from './SessionTimer';

export function SessionScreen({ options }: { options: SessionOptions }) {
  const router = useRouter();
  const { profile, record, ready, error, pending } = useAdaptive();
  const [state, dispatch] = useReducer(sessionReducer, options, initial => createSession({
    ...initial,
    planned: initial.planned ?? (initial.adaptive && ready && !error
      ? adaptiveQuestions(profile, initial.operation, initial.seed ?? 0, Number(initial.id?.split(':')[0]) || 0)
      : undefined),
  }));
  const recorded = useRef<readonly unknown[] | undefined>(undefined);
  useEffect(() => {
    if (state.phase !== 'completed' || recorded.current === state.attempts) return;
    recorded.current = state.attempts;
    record(state.id ?? (Date.now() + ':' + createSeed()), state.attempts, state.completedAt ?? Date.now(), state.completedDay);
  }, [state.phase, state.attempts, state.id, state.completedAt, state.completedDay, record]);

  const index = state.attempts.length;
  const question = state.questions[index];
  const total = state.questions.length;
  const { soundEffects } = useCompanionSettings();
  const previous = state.attempts[index - 1];
  useAnswerHaptics(previous);

  const leave = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);
  const pause = useCallback(() => dispatch({ type: 'pause', now: performance.now() }), []);
  const resume = useCallback(() => dispatch({ type: 'resume', now: performance.now() }), []);
  const retry = useCallback(() => {
    const seed = createSeed();
    const now = Date.now();
    dispatch({ type: 'restart', options: {
      ...options, seed, id: now + ':' + seed,
      planned: options.planned ?? (options.adaptive && ready && !error ? adaptiveQuestions(profile, options.operation, seed, now) : undefined),
    }, now: performance.now() });
  }, [options, profile, ready, error]);

  const confirmExit = useCallback(() => {
    pause();
    Alert.alert('End practice?', 'This session will be discarded.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End practice', style: 'destructive', onPress: leave },
    ]);
  }, [leave, pause]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      if (next !== 'active') pause();
    });
    const blur = Platform.OS === 'android' ? AppState.addEventListener('blur', pause) : undefined;
    if (AppState.currentState === 'active' || AppState.currentState === null) {
      dispatch({ type: 'start', now: performance.now() });
    } else {
      pause();
    }
    return () => { subscription.remove(); blur?.remove(); };
  }, [pause]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state.phase === 'completed') {
        if (!pending) leave();
      } else if (state.phase === 'paused') confirmExit();
      else pause();
      return true;
    });
    return () => subscription.remove();
  }, [state.phase, confirmExit, leave, pause, pending]);

  const generation = state.generation;
  const onKey = useCallback((key: Key) => {
    if (key === 'submit') {
      const wallTime = Date.now();
      dispatch({ type: 'submit', index, generation, now: performance.now(), wallTime, day: localDay(wallTime) });
    } else if (key === 'delete') dispatch({ type: 'backspace', index, generation });
    else dispatch({ type: 'digit', digit: key, index, generation });
  }, [index, generation]);

  const audio = soundEffects && <AnswerSounds attempt={previous} paused={state.phase === 'paused'} />;

  if (state.phase === 'completed') {
    return <>{audio}<Screen full contentStyle={styles.results}>
      <SessionResults attempts={state.attempts} onRetry={retry} onDone={leave} saving={pending} />
    </Screen></>;
  }

  if (state.phase === 'paused') {
    return <>{audio}<Screen full fill compact footer={<Button label="Resume" onPress={resume} />}>
      <View style={styles.header}>
        <IconButton icon={X} label="End practice" onPress={confirmExit} />
        <AppText variant="metadata" tone="muted">{index + 1} / {total}</AppText>
        <View style={styles.spacer} />
      </View>
      <SessionProgress total={total} completed={index} />
      <View style={styles.paused}>
        <CompanionStage expression="sleepy">
          <AppText variant="hero" accessibilityRole="header">A short break?</AppText>
          <AppText variant="body" tone="muted">Your timer is paused.</AppText>
          <SessionTimer activeSince={null} elapsedBefore={state.elapsedBefore} />
        </CompanionStage>
      </View>
      <Button label="Restart session" variant="secondary" onPress={() => Alert.alert(
        'Restart practice?', 'Your current answers will be discarded.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Restart', onPress: retry },
        ],
      )} />
    </Screen></>;
  }

  if (!question) return null;
  return <>{audio}<Screen full fill compact footer={
    <Keypad onKey={onKey} canSubmit={state.phase === 'active' && state.input.length > 0} />
  }>
    <View style={styles.header}>
      <IconButton icon={X} label="End practice" onPress={confirmExit} />
      <AppText variant="metadata" style={styles.counter}>{index + 1} / {total}</AppText>
      <IconButton icon={Pause} label="Pause" onPress={pause} />
    </View>
    <SessionProgress total={total} completed={index} />
    <View style={styles.clock}>
      <SessionTimer activeSince={state.activeSince} elapsedBefore={state.elapsedBefore} />
    </View>
    <QuestionStage question={question} input={state.input} previous={previous} />
  </Screen></>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  spacer: { width: 48 },
  counter: { fontVariant: ['tabular-nums'] },
  clock: { alignItems: 'center' },
  paused: { flexGrow: 1, minHeight: 200, justifyContent: 'center', gap: spacing.md },
  results: { gap: spacing.lg },
});
