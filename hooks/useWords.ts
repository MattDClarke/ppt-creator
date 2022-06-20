import { Dispatch, useReducer } from 'react';
import { Word } from '../types';

export type ActionType =
  | { type: 'ADD'; text: string }
  | { type: 'EDIT'; id: number; text: string }
  | { type: 'REMOVE'; id: number };

export default function useWords(
  initialWords: Word[]
): [words: Word[], dispatch: Dispatch<ActionType>] {
  const [words, dispatch] = useReducer((state: Word[], action: ActionType) => {
    switch (action.type) {
      case 'ADD':
        return [...state, { id: Date.now(), word: action.text }];
      case 'EDIT':
        return state.map(word =>
          word.id === action.id ? { ...word, word: action.text } : word
        );
      case 'REMOVE':
        return state.filter(({ id }) => id !== action.id);
      default:
        throw new Error();
    }
  }, initialWords);

  return [words, dispatch];
}
