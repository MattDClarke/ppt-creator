import React, { Dispatch, SetStateAction, useReducer } from 'react';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';
import type { State, Action } from './PptCreate.types';
import PptCreateImgSearch from './ImgSearch';
import LoadingBar from './LoadingBar';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'Step_Increase':
      return { ...state, step: state.step + 1 };
    case 'Step_Decrease':
      return { ...state, step: state.step - 1 };
    case 'Add_Img_Unsplash':
      const { selectedImgs } = state;
      const newSelectedImgs = selectedImgs.map(selectedImgObj =>
        selectedImgObj.step === action.step
          ? {
              ...selectedImgObj,
              img: action.img,
              originalImgWidth: action.originalImgWidth,
              originalImgHeight: action.originalImgHeight,
              triggerDownloadAPI: action.triggerDownloadAPI,
            }
          : selectedImgObj
      );

      return { ...state, selectedImgs: newSelectedImgs };

    default:
      throw new Error();
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

  const getInitialState = (): State => {
    const selectedImgsObjArr = words.map((word, i) => ({
      step: i,
      word: word.word,
      img: null,
      translation: null,
      originalImgWidth: null,
      originalImgHeight: null,
      triggerDownloadAPI: null,
    }));
    return {
      step: 0,
      title: title,
      selectedImgs: selectedImgsObjArr,
    };
  };
  // REDUCER THAT HOLDS THE LOGIC AND INFO FOR THE WHOLE FLOW
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const numWords = words.length;
  const totalSteps = numWords + 1;

  // STEP CHECKER
  if (state.step < 0 || state.step > totalSteps) {
    throw 'Step Threshold Exceeded';
  }

  return (
    <>
      {words.map((word, i) => (
        <Modal
          key={word.id + i}
          isOpen={pptCreateModalIsOpen}
          closeModal={closeModal}
          style={{
            content: { width: 767 },
            overlay: {
              visibility: i !== state.step ? 'hidden' : 'visible',
            },
          }}
          aria-hidden={i !== state.step ? 'true' : 'false'}
        >
          <Modal.Header closeModal={closeModal} style={{ margin: '0 auto' }}>
            <LoadingBar numWords={numWords} step={state.step} />
            {state.step < numWords &&
              `Choose an image for each word - Click an image to select it`}
          </Modal.Header>
          <div>
            <Modal.Content
              style={{
                overflowY: 'auto',
                maxHeight: '70vh',
                textAlign: 'center',
              }}
            >
              <>
                <div style={{ padding: '1.5rem 0.5rem' }}>
                  {`Word ${state.step + 1} of ${numWords}: "${
                    word?.word
                  }" for list "${state.title}"`}
                </div>
                <PptCreateImgSearch
                  word={word?.word}
                  index={i}
                  state={state}
                  dispatch={dispatch}
                />
              </>
            </Modal.Content>
          </div>
          <Modal.Actions
            cancelText="Previous"
            cancelClick={() => dispatch({ type: 'Step_Decrease' })}
            cancelDisabled={state.step === 0}
            confirmText={state.step === numWords ? 'Create ppt' : 'Next'}
            confirmClick={() => dispatch({ type: 'Step_Increase' })}
            confirmDisabled={state.step >= numWords + 1}
            hideActions={state.step >= numWords + 1}
          ></Modal.Actions>
        </Modal>
      ))}

      {/* ppt Options step */}
      {state.step === numWords && (
        <Modal
          isOpen={pptCreateModalIsOpen}
          closeModal={closeModal}
          style={{
            content: { width: 767 },
            overlay: {
              visibility: state.step !== numWords ? 'hidden' : 'visible',
              // prevent opacity transition animation
              opacity: 1,
            },
          }}
          aria-hidden={state.step !== numWords ? 'true' : 'false'}
        >
          <Modal.Header closeModal={closeModal} style={{ margin: '0 auto' }}>
            <LoadingBar numWords={numWords} step={state.step} />
            Select ppt options
          </Modal.Header>
          <div>
            <Modal.Content
              style={{
                overflowY: 'auto',
                maxHeight: '70vh',
                textAlign: 'center',
              }}
            >
              <div>ppt Options form</div>
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
      )}

      {/* ppt creation complete step */}
      {state.step === numWords + 1 && (
        <Modal
          isOpen={pptCreateModalIsOpen}
          closeModal={closeModal}
          style={{
            content: { width: 767 },
            overlay: {
              visibility: state.step !== numWords + 1 ? 'hidden' : 'visible',
              // prevent opacity transition animation
              opacity: 1,
            },
          }}
          aria-hidden={state.step !== numWords + 1 ? 'true' : 'false'}
        >
          <Modal.Header closeModal={closeModal} style={{ margin: '0 auto' }}>
            <LoadingBar numWords={numWords} step={state.step} />
            ppt creation complete
          </Modal.Header>
          <div>
            <Modal.Content
              style={{
                overflowY: 'auto',
                maxHeight: '70vh',
                textAlign: 'center',
              }}
            >
              <div>complete message</div>
            </Modal.Content>
          </div>
          <Modal.Actions hideActions={true}></Modal.Actions>
        </Modal>
      )}
    </>
  );
}
