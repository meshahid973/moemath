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
import { createSeed } from '@/engine/session/options';
import { createSession, sessionReducer } from '@/engine/session/session';
import { spacing } from '@/theme/tokens';
import { Keypad, type Key } from './Keypad';
import { QuestionStage } from './QuestionStage';
import { SessionProgress } from './SessionProgress';
import { SessionResults } from './SessionResults';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { CompanionDialogue } from '@/features/companion/CompanionDialogue';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { AnswerSounds } from './AnswerSounds';
import { useAnswerHaptics } from './useAnswerHaptics';
import { SessionTimer } from './SessionTimer';

export function SessionScreen({ options }: { options: SessionOptions }) {
  const router = useRouter();
  const { profile, record, ready, error, pending } = useAdaptive();
  const [state, dispatch] = useReducer(sessionReducer, options, initial => createSession({ ...initial, planned: initial.planned ?? (initial.adaptive && ready && !error ? adaptiveQuestions(profile, initial.operation, initial.seed ?? 0, Number(initial.id?.split(':')[0]) || 0) : undefined) }));
  const recorded = useRef<readonly unknown[] | undefined>(undefined);
  useEffect(() => {
    if (state.phase !== 'completed' || recorded.current === state.attempts) return;
    recorded.current = state.attempts;
    record(state.id ?? (Date.now() + ':' + createSeed()), state.attempts);
  }, [state.phase, state.attempts, state.id, record]);
  const index = state.attempts.length;
  const question = state.questions[index];
  const total = state.questions.length;
  const { showCompanion, soundEffects } = useCompanionSettings();
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
    dispatch({ type: 'restart', options: { ...options, seed, id: now + ':' + seed, planned: options.planned ?? (options.adaptive && ready && !error ? adaptiveQuestions(profile, options.operation, seed, now) : undefined) }, now: performance.now() });
  }, [options, profile, ready, error]);

  const confirmExit = useCallback(() => {
    pause();
    Alert.alert('End practice?', 'This session will be discarded.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End practice', style: 'destructive', onPress: leave },
    ]);
  }, [leave, pause]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next !== 'active') pause();
    });
    const blur = Platform.OS === 'android' ? AppState.addEventListener('blur', pause) : undefined;
    if (AppState.currentState === 'active' || AppState.currentState === null) {
      dispatch({ type: 'start', now: performance.now() });
    } else {
      pause();
    }
    return () => {
      subscription.remove();
      blur?.remove();
    };
  }, [pause]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state.phase === 'completed') {
        leave();
      } else if (state.phase === 'paused') {
        confirmExit();
      } else {
        pause();
      }
      return true;
    });
    return () => subscription.remove();
  }, [state.phase, confirmExit, leave, pause]);

  const generation = state.generation;
  const onKey = useCallback((key: Key) => {
    if (key === 'submit') dispatch({ type: 'submit', index, generation, now: performance.now() });
    else if (key === 'delete') dispatch({ type: 'backspace', index, generation });
    else dispatch({ type: 'digit', digit: key, index, generation });
  }, [index, generation]);

  const audio = soundEffects && <AnswerSounds attempt={previous} paused={state.phase === 'paused'} />;

  if (state.phase === 'completed') {
    return <>{audio}<Screen full><SessionResults attempts={state.attempts} onRetry={retry} onDone={leave} saving={pending} /></Screen></>;
  }

  if (state.phase === 'paused') {
    return (
      <>{audio}<Screen full fill compact>
        <View style={styles.header}>
          <IconButton icon={X} label="End practice" onPress={confirmExit} />
          <AppText variant="label">{index + 1} / {total}</AppText>
          <View style={styles.headerSpacer} />
        </View>
        <SessionProgress total={total} completed={index} />
        <View style={styles.paused}>
          {showCompanion && hasCompanion && <CompanionPortrait expression="sleepy" size={108} />}
          <AppText variant="title">Paused</AppText>
          {showCompanion && <CompanionDialogue message="Take your time." />}
          <SessionTimer activeSince={null} elapsedBefore={state.elapsedBefore} />
        </View>
        <Button label="Resume" onPress={resume} />
        <Button label="Restart" variant="secondary" onPress={() => Alert.alert('Restart practice?', 'Your current answers will be discarded.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Restart', onPress: retry },
        ])} />
        <Button label="End practice" variant="secondary" onPress={confirmExit} />
      </Screen></>
    );
  }

  if (!question) return null;

  return (
    <>{audio}<Screen full fill compact>
      <View style={styles.header}>
        <IconButton icon={X} label="End practice" onPress={confirmExit} />
        <AppText variant="label" style={styles.counter}>{index + 1} / {total}</AppText>
        <IconButton icon={Pause} label="Pause" onPress={pause} />
      </View>
      <SessionProgress total={total} completed={index} />
      <View style={styles.clock}>
        <SessionTimer activeSince={state.activeSince} elapsedBefore={state.elapsedBefore} />
      </View>
      <QuestionStage question={question} input={state.input} previous={previous} />
      <Keypad onKey={onKey} canSubmit={state.phase === 'active' && state.input.length > 0} />
    </Screen></>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  headerSpacer: { width: 48 },
  counter: { fontVariant: ['tabular-nums'] },
  clock: { alignItems: 'center' },
  paused: { flexGrow: 1, minHeight: 180, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
});
