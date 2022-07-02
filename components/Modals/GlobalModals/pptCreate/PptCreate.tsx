import React, { Dispatch, SetStateAction, useReducer } from 'react';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';
import type { State, Action } from './PptCreate.types';

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
  words: Word[];
  pptCreateModalIsOpen: boolean;
  setPptCreateModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function PptCreate({
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
        <Modal.Header closeModal={closeModal}>
          Select images for each word
        </Modal.Header>
        <div>
          <Modal.Content>
            {words.map((word, i) => (
              <div
                key={word.id}
                className={i !== state.step ? 'hide' : ''}
                aria-hidden={i !== state.step ? 'true' : 'false'}
              >
                {word.word} {state.step}
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
          confirmText="Next"
          confirmClick={() => dispatch({ type: 'Step_Increase' })}
          confirmDisabled={state.step >= numWords + 1}
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
