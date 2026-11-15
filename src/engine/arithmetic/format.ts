import { symbols, type Question } from './types.ts';

export function formatEquation(question: Pick<Question, 'left' | 'right' | 'operation'>): string {
  return question.left + ' ' + symbols[question.operation] + ' ' + question.right;
}
