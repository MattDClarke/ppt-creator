import { useEffect, useRef, useState, Dispatch } from 'react';
import { ActionType } from '../../hooks/useWords';
import { AiFillEdit, AiFillDelete, AiOutlineCheckCircle } from 'react-icons/ai';
import useToggleState from '../../hooks/useToggleState';
import { Word } from '../../types';

type Props = {
  word: Word;
  dispatch: Dispatch<ActionType>;
};

export default function Singleword({ word, dispatch }: Props) {
  const [isEditing, toggleIsEditing] = useToggleState(false);
  const [editedWord, setEditedWord] = useState(word.word);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) dispatch({ type: 'EDIT', id: word.id, text: editedWord });
    toggleIsEditing();
  };

  return (
    <form onSubmit={handleSubmit}>
      {isEditing ? (
        <input
          value={editedWord}
          onChange={e => setEditedWord(e.target.value)}
          ref={inputRef}
          maxLength={50}
        />
      ) : (
        <span>{word.word}</span>
      )}
      <button
        type="submit"
        aria-label="Edit word"
        disabled={editedWord.length === 0}
      >
        {!isEditing ? <AiFillEdit /> : <AiOutlineCheckCircle />}
      </button>
      <button
        type="button"
        aria-label="Delete word"
        onClick={() => dispatch({ type: 'REMOVE', id: word.id })}
      >
        <AiFillDelete />
      </button>
    </form>
  );
}
