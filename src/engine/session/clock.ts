export function formatTime(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}

export function nextSecondDelay(elapsed: number) {
  return Math.max(16, Math.ceil(1000 - Math.max(0, elapsed) % 1000));
}
