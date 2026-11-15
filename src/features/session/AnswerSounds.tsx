import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import correctSound from '../../../assets/sounds/correct.wav';
import retrySound from '../../../assets/sounds/retry.wav';
import type { SessionAttempt } from '@/engine/session/session';

export function AnswerSounds({ attempt, paused }: { attempt?: SessionAttempt; paused: boolean }) {
  const correct = useAudioPlayer(correctSound);
  const retry = useAudioPlayer(retrySound);
  const lastAttempt = useRef<SessionAttempt | undefined>(undefined);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: false, shouldPlayInBackground: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
  }, []);

  useEffect(() => {
    const fresh = lastAttempt.current !== attempt;
    lastAttempt.current = attempt;
    if (!fresh || !attempt || paused || AppState.currentState !== 'active') return;
    let cancelled = false;
    const player = attempt.expected === attempt.submitted ? correct : retry;
    void (async () => {
      try {
        correct.pause();
        retry.pause();
        await player.seekTo(0);
        if (!cancelled && AppState.currentState === 'active') player.play();
      } catch {
        // Sound failure must not interrupt practice.
      }
    })();
    return () => {
      cancelled = true;
      try { player.pause(); } catch { /* player already released */ }
    };
  }, [attempt, paused, correct, retry]);

  return null;
}
