import { symbols, type PracticeOperation } from '@/engine/arithmetic/types';

export const operationChoices = [
  { value: 'mixed', label: 'Mixed', mark: '±' },
  { value: 'addition', label: 'Addition', mark: symbols.addition },
  { value: 'subtraction', label: 'Subtraction', mark: symbols.subtraction },
  { value: 'multiplication', label: 'Multiplication', mark: symbols.multiplication },
  { value: 'division', label: 'Division', mark: symbols.division },
] as const;

export const operationColors: Record<'light' | 'dark', Record<PracticeOperation, string>> = {
  light: { mixed: '#7755B0', addition: '#16715F', subtraction: '#A63760', multiplication: '#7755B0', division: '#286A99' },
  dark: { mixed: '#B69BE8', addition: '#83D4C2', subtraction: '#F3A3BD', multiplication: '#B69BE8', division: '#91C8ED' },
};
