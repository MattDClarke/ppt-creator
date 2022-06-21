import { useRef, useState } from 'react';
import InlineForm from '../components/InlineForm/InlineForm';
import DataScreenList from '../components/WordListForm/DataScreenList';
import useWords from '../hooks/useWords';

export default function PptCreatorPage() {
  const [word, setWord] = useState('');
  const [words, dispatch] = useWords([]);

  // some refs so when we edit a list item, we can focus the input
  const vocabularyInputRef = useRef<HTMLInputElement>(null);
  const vocabularyListRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container">
      <InlineForm
        placeholder="Vocabulary here..."
        value={word}
        onChange={(newValue: string) => setWord(newValue)}
        onSubmit={(vocabulary: string) => {
          if (vocabulary === '') return;
          dispatch({ type: 'ADD', text: vocabulary });
          setWord('');
        }}
        ref={vocabularyInputRef}
      />

      <DataScreenList
        showPlaceholders={false}
        disableHover={false}
        list={words}
        editListItem={(id: number, text: string) => {
          // dispatch({ type: 'EDIT', id, text });
          setWord(text);
          dispatch({ type: 'REMOVE', id });
          vocabularyInputRef.current?.focus();
        }}
        removeListItem={(id: number) => dispatch({ type: 'REMOVE', id })}
        ref={vocabularyListRef}
      />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
