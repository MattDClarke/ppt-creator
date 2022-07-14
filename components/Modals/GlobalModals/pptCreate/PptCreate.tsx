import React, { Dispatch, SetStateAction, useReducer } from 'react';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';
import type { State, Action } from './PptCreate.types';
import PptCreateImgSearch from './PptCreateImgSearch';
import LoadingBar from './LoadingBar';

const initialState: State = {
  step: 0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'Step_Increase':
      return { ...state, step: state.step + 1 };
    case 'Step_Decrease':
      return { ...state, step: state.step - 1 };
  }
};

type Props = {
  title: string;
  words: Word[];
  pptCreateModalIsOpen: boolean;
  setPptCreateModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PptCreate({
  title,
  words,
  pptCreateModalIsOpen,
  setPptCreateModalIsOpen,
}: Props) {
  const closeModal = () => setPptCreateModalIsOpen(false);

  // REDUCER THAT HOLDS THE LOGIC AND INFO FOR THE WHOLE FLOW
  const [state, dispatch] = useReducer(reducer, initialState);

  const numWords = words.length;

  // STEP CHECKER
  if (state.step < 0 || state.step > numWords + 1) {
    throw 'Step Threshold Exceeded';
  }

  return (
    <>
      <Modal
        isOpen={pptCreateModalIsOpen}
        closeModal={closeModal}
        style={{ content: { width: 767 } }}
      >
        <Modal.Header closeModal={closeModal} style={{ margin: '0 auto' }}>
          <LoadingBar numWords={numWords} step={state.step} />
          {state.step < numWords &&
            'Choose an image for each word - Click an image to select it'}
          {state.step === numWords && 'Select ppt options'}
          {state.step === numWords + 1 && 'ppt creation complete'}
        </Modal.Header>
        <div>
          <Modal.Content
            style={{
              overflowY: 'auto',
              maxHeight: '70vh',
              textAlign: 'center',
            }}
          >
            {words.map((word, i) => (
              <div
                key={word.id}
                className={i !== state.step ? 'hide' : ''}
                aria-hidden={i !== state.step ? 'true' : 'false'}
              >
                <div style={{ padding: '1.5rem 0.5rem' }}>
                  {`Word ${state.step + 1} of ${numWords}: "${
                    word.word
                  }" for list "${title}"`}
                </div>
                <PptCreateImgSearch word={word.word} />
              </div>
            ))}
            <div
              className={state.step !== numWords ? 'hide' : ''}
              aria-hidden={state.step !== numWords ? 'true' : 'false'}
            >
              ppt Options form
            </div>
            <div
              className={state.step !== numWords + 1 ? 'hide' : ''}
              aria-hidden={state.step !== numWords + 1 ? 'true' : 'false'}
            >
              complete message
            </div>
          </Modal.Content>
        </div>
        <Modal.Actions
          cancelText="Previous"
          cancelClick={() => dispatch({ type: 'Step_Decrease' })}
          cancelDisabled={state.step === 0}
          confirmText={state.step === numWords ? 'Create ppt' : 'Next'}
          // TODO confirm click when state.step === numWords -> action -> create ppt
          confirmClick={() => dispatch({ type: 'Step_Increase' })}
          confirmDisabled={state.step >= numWords + 1}
          hideActions={state.step >= numWords + 1}
        ></Modal.Actions>
      </Modal>
      <style jsx>{`
        /* Visually hide element - but visible for screen reader */
        /* https://gomakethings.com/hidden-content-for-better-a11y/#hiding-the-link */
        .hide {
          border: 0;
          clip: rect(0 0 0 0);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `}</style>
    </>
  );
}
