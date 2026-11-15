export const operations = ['addition', 'subtraction', 'multiplication', 'division'] as const;
export type Operation = (typeof operations)[number];
export type PracticeOperation = Operation | 'mixed';
export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6;

export type Question = Readonly<{
  operation: Operation;
  difficulty: Difficulty;
  left: number;
  right: number;
  answer: number;
  key: string;
}>;

export const symbols: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};
