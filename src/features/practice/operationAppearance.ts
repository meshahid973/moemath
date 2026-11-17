import { symbols, type PracticeOperation } from '../../engine/arithmetic/types.ts';

export const operationChoices = [
  { value: 'mixed', label: 'Mixed', mark: 'Â±' },
  { value: 'addition', label: 'Addition', mark: symbols.addition },
  { value: 'subtraction', label: 'Subtraction', mark: symbols.subtraction },
  { value: 'multiplication', label: 'Multiplication', mark: symbols.multiplication },
  { value: 'division', label: 'Division', mark: symbols.division },
] as const;

export const operationColors: Record<'light' | 'dark', Record<PracticeOperation, string>> = {
  light: { mixed: '#693B82', addition: '#17634F', subtraction: '#A12D58', multiplication: '#693B82', division: '#245B81' },
  dark: { mixed: '#D8B5F2', addition: '#83D4C2', subtraction: '#F3A3BD', multiplication: '#D8B5F2', division: '#91C8ED' },
};
