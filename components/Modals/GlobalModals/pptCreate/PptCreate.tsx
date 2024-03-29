import React, { Dispatch, SetStateAction, useReducer, useState } from 'react';
import { useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';
import type { State, Action } from './PptCreate.types';
import PptCreateImgSearch from './ImgSearch';
import LoadingBar from './LoadingBar';
import PptOptionsForm from './PptOptionsForm';
import { imagesSrcToDataURL } from '../../../../helpers/urlToBase64';
import Loader from './Loader';
import createPpt from 'helpers/createPpt';

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
    case 'Add_Ppt_Options':
      return {
        ...state,
        pptOptions: {
          fontFace: action.fontFace,
          bold: action.bold,
          italic: action.italic,
          color: action.color,
          backgroundColor: action.backgroundColor,
        },
      };
    case 'Add_Optimized_Imgs':
      return {
        ...state,
        selectedImgs: action.optimizedImgs,
      };

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
      img: '',
      translation: '',
      originalImgWidth: 0,
      originalImgHeight: 0,
      triggerDownloadAPI: '',
    }));
    return {
      step: 0,
      title: title,
      selectedImgs: selectedImgsObjArr,
      pptOptions: {
        fontFace: '',
        bold: false,
        italic: false,
        color: {
          hex: '#000000',
          rgb: {
            r: 0,
            g: 0,
            b: 0,
          },
          hsv: {
            h: 0,
            s: 0,
            v: 0,
          },
        },
        backgroundColor: {
          hex: '#f8f3f3',
          rgb: {
            r: 248,
            g: 243,
            b: 243,
          },
          hsv: {
            h: 0,
            s: 2.133331298828125,
            v: 97.36111132303874,
          },
        },
      },
    };
  };
  // REDUCER THAT HOLDS THE LOGIC AND INFO FOR THE WHOLE FLOW
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const numWords = words.length;
  const totalSteps = numWords + 1;

  // for ppt options form
  const [fontFace, setFontFace] = useState('Arial');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [color, setColor] = useColor('hex', '#000000');
  const [backgroundColor, setBackgroundColor] = useColor('hex', '#FFFFFF');

  // for ppt creation loading state
  const [pptLoading, setPptLoading] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  // STEP CHECKER
  if (state.step < 0 || state.step > totalSteps) {
    throw 'Step Threshold Exceeded';
  }

  function loadingMsg() {
    if (pptLoading === 'loading') {
      return (
        <Loader circleDiameter={20} colorDark="#64c9ff" colorLight="#cdeeff" />
      );
    }
    if (pptLoading === 'success') {
      return 'ppt Created! Check your downloads folder.';
    }
    if (pptLoading === 'error') {
      return 'There was an error creating the ppt. Please try again.';
    }
  }

  async function handlePptCreate() {
    dispatch({
      type: 'Add_Ppt_Options',
      fontFace,
      bold,
      italic,
      color,
      backgroundColor,
    });
    dispatch({ type: 'Step_Increase' });
    const { selectedImgs } = state;
    let optimizedImgs;
    try {
      optimizedImgs = await imagesSrcToDataURL(selectedImgs);
    } catch {
      setPptLoading('error');
    }

    if (typeof optimizedImgs !== 'undefined') {
      dispatch({ type: 'Add_Optimized_Imgs', optimizedImgs });

      // create ppt
      try {
        await createPpt({ ...state, selectedImgs: optimizedImgs });
        setPptLoading('success');
      } catch (error) {
        setPptLoading('error');
      }
    }
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
            confirmDisabled={
              state.step >= numWords + 1 || state.selectedImgs[i].img === ''
            }
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
          <Modal.Header
            closeModal={closeModal}
            style={{
              margin: '0 auto',
            }}
          >
            <LoadingBar numWords={numWords} step={state.step} />
            Select PowerPoint options
          </Modal.Header>
          <div>
            <Modal.Content
              style={{
                overflowY: 'auto',
                maxHeight: '70vh',
              }}
            >
              <PptOptionsForm
                fontFace={fontFace}
                bold={bold}
                italic={italic}
                color={color}
                backgroundColor={backgroundColor}
                setFontFace={setFontFace}
                setBold={setBold}
                setItalic={setItalic}
                setColor={setColor}
                setBackgroundColor={setBackgroundColor}
              />
            </Modal.Content>
          </div>
          <Modal.Actions
            cancelText="Previous"
            cancelClick={() => dispatch({ type: 'Step_Decrease' })}
            cancelDisabled={state.step === 0}
            confirmText={state.step === numWords ? 'Create ppt' : 'Next'}
            confirmClick={handlePptCreate}
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
              <div>{loadingMsg()}</div>
            </Modal.Content>
          </div>
          <Modal.Actions hideActions={true}></Modal.Actions>
        </Modal>
      )}
    </>
  );
}
