import { palettes } from '../../theme/tokens.ts';
import { symbols, type PracticeOperation } from '../../engine/arithmetic/types.ts';

export const operationChoices = [
  { value: 'mixed', label: 'Mixed', mark: 'Â±' },
  { value: 'addition', label: 'Addition', mark: symbols.addition },
  { value: 'subtraction', label: 'Subtraction', mark: symbols.subtraction },
  { value: 'multiplication', label: 'Multiplication', mark: symbols.multiplication },
  { value: 'division', label: 'Division', mark: symbols.division },
] as const;

function operationPalette(primary: string): Record<PracticeOperation, string> {
  return { mixed: primary, addition: primary, subtraction: primary, multiplication: primary, division: primary };
}
export const operationColors = {
  light: operationPalette(palettes.light.primary),
  dark: operationPalette(palettes.dark.primary),
};
