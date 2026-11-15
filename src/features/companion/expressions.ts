export const expressions = ['neutral', 'happy', 'thinking', 'encouraging', 'surprised', 'sleepy'] as const;
export type Expression = (typeof expressions)[number];

export function answerExpression(correct: boolean): Expression {
  return correct ? 'happy' : 'encouraging';
}

export function resultExpression(correct: number, total: number): Expression {
  if (total > 0 && correct === total) return 'surprised';
  return total > 0 && correct / total >= 0.8 ? 'happy' : 'encouraging';
}
