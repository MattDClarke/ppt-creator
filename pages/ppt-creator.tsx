import { useState } from 'react';
import InputForm from '../components/WordListForm/WordInputForm';
import WordList from '../components/WordListForm/WordList';
import useWords from '../hooks/useWords';
// import { TodoList } from '../components/TodoList/TodoList';
// import { InputForm } from '../components/TodoList/InputForm';
// import { H1 } from '../components/Tailwind/TailwindComponents';
// import { useTodos } from '../hooks/useWordList';
// import { Todo } from '../interfaces';

export default function PptCreatorPage() {
  const [word, setWord] = useState('');
  const [words, dispatch] = useWords([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (word) {
      dispatch({ type: 'ADD', text: word });
      setWord('');
    }
  };
  return (
    <>
      <InputForm word={word} setWord={setWord} handleAdd={handleAdd} />
      <WordList words={words} dispatch={dispatch} />
    </>
  );
}
