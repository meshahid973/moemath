import { generateQuestions, type SessionOptions } from '../arithmetic/questions.ts';
import type { Question } from '../arithmetic/types.ts';
import { parseAnswer, type Attempt } from '../scoring.ts';

export type SessionAttempt = Attempt & Readonly<{
  question: Question;
  interrupted: boolean;
}>;

export type Session = Readonly<{
  id?: string;
  generation: number;
  completedAt?: number;
  completedDay?: string;
  phase: 'ready' | 'active' | 'paused' | 'completed';
  questions: readonly Question[];
  attempts: readonly SessionAttempt[];
  input: string;
  elapsedBefore: number;
  activeSince: number | null;
  questionStartedAt: number;
  interrupted: boolean;
}>;

export type SessionAction =
  | { type: 'start' | 'pause' | 'resume'; now: number }
  | { type: 'digit'; digit: string; index: number; generation?: number }
  | { type: 'backspace'; index: number; generation?: number }
  | { type: 'submit'; index: number; generation?: number; now: number; wallTime?: number; day?: string }
  | { type: 'restart'; options: SessionOptions; now: number };

const MAX_INPUT_LENGTH = 5;

export function createSession(options: SessionOptions): Session {
  return {
    id: options.id,
    generation: 0,
    phase: 'ready',
    questions: options.planned ?? generateQuestions(options),
    attempts: [],
    input: '',
    elapsedBefore: 0,
    activeSince: null,
    questionStartedAt: 0,
    interrupted: false,
  };
}

export function elapsedAt(state: Pick<Session, 'activeSince' | 'elapsedBefore'>, now: number): number {
  return state.elapsedBefore + (state.activeSince === null ? 0 : Math.max(0, now - state.activeSince));
}

export function sessionReducer(state: Session, action: SessionAction): Session {
  switch (action.type) {
    case 'restart':
      return { ...createSession(action.options), phase: 'active', activeSince: action.now, generation: state.generation + 1 };
    case 'start':
      return state.phase === 'ready' ? { ...state, phase: 'active', activeSince: action.now } : state;
    case 'pause':
      if (state.phase !== 'active' && state.phase !== 'ready') return state;
      return {
        ...state,
        phase: 'paused',
        elapsedBefore: elapsedAt(state, action.now),
        activeSince: null,
        interrupted: state.interrupted || state.phase === 'active',
      };
    case 'resume':
      return state.phase === 'paused' ? { ...state, phase: 'active', activeSince: action.now } : state;
  }

  // Ignore callbacks from an older question or a paused session.
  const index = state.attempts.length;
  if (state.phase !== 'active' || action.index !== index || (action.generation !== undefined && action.generation !== state.generation)) return state;

  if (action.type === 'digit') {
    if (!/^\d$/.test(action.digit) || state.input.length >= MAX_INPUT_LENGTH) return state;
    return { ...state, input: state.input === '0' ? action.digit : state.input + action.digit };
  }

  if (action.type === 'backspace') {
    return state.input ? { ...state, input: state.input.slice(0, -1) } : state;
  }

  const question = state.questions[index];
  const submitted = parseAnswer(state.input);
  if (!question || submitted === null) return state;

  const elapsed = elapsedAt(state, action.now);
  const attempt: SessionAttempt = {
    question,
    expected: question.answer,
    submitted,
    elapsedMs: Math.max(0, elapsed - state.questionStartedAt),
    interrupted: state.interrupted,
  };
  const attempts = [...state.attempts, attempt];
  const completed = attempts.length === state.questions.length;

  return {
    ...state,
    attempts,
    phase: completed ? 'completed' : 'active',
    completedAt: completed ? action.wallTime : undefined,
    completedDay: completed ? action.day : undefined,
    input: '',
    elapsedBefore: completed ? elapsed : state.elapsedBefore,
    activeSince: completed ? null : state.activeSince,
    questionStartedAt: elapsed,
    interrupted: false,
  };
}
