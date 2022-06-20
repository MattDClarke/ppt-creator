import { Dispatch } from 'react';
import SingleWord from './SingleWord';
import { ActionType } from '../../hooks/useWords';
import { Word } from '../../types';

type Props = {
  words: Word[];
  dispatch: Dispatch<ActionType>;
};

export default function WordList({ words, dispatch }: Props) {
  return (
    <div>
      {words.map(word => (
        <SingleWord key={word.id} word={word} dispatch={dispatch} />
      ))}
    </div>
  );
}
