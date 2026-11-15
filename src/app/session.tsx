import { useLocalSearchParams } from 'expo-router';
import { readSessionOptions, type SessionParams } from '@/engine/session/options';
import { SessionScreen } from '@/features/session/SessionScreen';

export default function SessionRoute() {
  const params = useLocalSearchParams<SessionParams>();
  const options = readSessionOptions(params);
  return <SessionScreen key={options.operation + ':' + options.difficulty + ':' + options.seed + ':' + options.id + ':' + options.adaptive} options={options} />;
}
