import PptCreate from 'components/Modals/GlobalModals/pptCreate';
import { useRef, useState } from 'react';
import Button from 'components/Button';
import InlineForm from 'components/InlineForm/InlineForm';
import DataScreenList from 'components/WordListForm/DataScreenList';
import useWords from 'hooks/useWords';

export default function PptCreatorPage() {
  const [word, setWord] = useState('');
  const [words, dispatch] = useWords([]);
  const [pptCreateModalIsOpen, setPptCreateModalIsOpen] = useState(false);

  // some refs so when we edit a list item, we can focus the input
  const vocabularyInputRef = useRef<HTMLInputElement>(null);
  const vocabularyListRef = useRef<HTMLDivElement>(null);
  return (
    <div className="container">
      <h1>ppt Creator</h1>
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
      <Button
        size="lg"
        aria-label="Create ppt"
        text="Create ppt"
        color="white"
        bgColor="#027E1B"
        onClick={() => {
          setPptCreateModalIsOpen(true);
        }}
        disabled={words.length < 3}
      />

      {pptCreateModalIsOpen && (
        <PptCreate
          words={words}
          pptCreateModalIsOpen={pptCreateModalIsOpen}
          setPptCreateModalIsOpen={setPptCreateModalIsOpen}
        />
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
