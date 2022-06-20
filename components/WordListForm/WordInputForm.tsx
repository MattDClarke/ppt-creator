import React from 'react';

type Props = {
  word: string;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
};

export default function InputForm({ word, setWord, handleAdd }: Props) {
  return (
    <form onSubmit={handleAdd}>
      <input
        type="input"
        value={word}
        onChange={e => setWord(e.target.value)}
        placeholder="Enter word"
        maxLength={50}
      />
      <button type="submit">Add</button>
    </form>
  );
}
