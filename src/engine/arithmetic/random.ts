export type Random = () => number;

// Mulberry32. Seeded sessions can be replayed exactly.
export function createRandom(seed: number): Random {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RangeError('Invalid seed');
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(random: Random, min: number, max: number): number {
  const value = random();
  if (!(value >= 0 && value < 1)) throw new RangeError('Random value must be in [0, 1)');
  return min + Math.floor(value * (max - min + 1));
}
