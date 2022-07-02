import React, { Dispatch, SetStateAction, useReducer } from 'react';
// import { SetterProvider } from 'contexts/setter';
// import { useStore } from 'contexts/store';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';

// import LessonsGrades from './LessonsGrades';
// import LessonsBooks from './LessonsBooks';
// import LessonsLessons from './LessonsLessons';
// import LessonsData from './LessonsData';
import type { State, Action } from './PptCreate.types';

// const steps: Steps[] = [
//   'LOADING',
//   'CHOOSE_GRADE',
//   'CHOOSE_BOOK',
//   'CHOOSE_LESSONS',
//   'EDIT_DATA',
// ];

const initialState: State = {
  step: 0,
  // grades: [],
  // books: {},
  // lessons: {},
  // chosenGrade: '',
  // chosenBook: '',
  // chosenBookImg: '',
  // chosenLessons: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'Step_Increase':
      return { ...state, step: state.step + 1 };
    case 'Step_Decrease':
      return { ...state, step: state.step - 1 };
    // case 'Set_Grades':
    //   return {
    //     ...state,
    //     step: 1,
    //     grades: action.grades,
    //   };
    // case 'Set_Books':
    //   return {
    //     ...state,
    //     step: 2,
    //     books: { ...state.books, [action.gradeId]: action.books },
    //   };
    // case 'Set_Lessons':
    //   return {
    //     ...state,
    //     step: 3,
    //     lessons: { ...state.lessons, [action.bookId]: action.lessons },
    //   };
    // case 'Choose_Grade':
    //   return {
    //     ...state,
    //     step: 2,
    //     chosenGrade: action.chosenGrade,
    //   };
    // case 'Choose_Book':
    //   return {
    //     ...state,
    //     chosenBook: action.chosenBook,
    //     chosenBookImg: action.chosenBookImg,
    //     step: 3,
    //   };
    // case 'Choose_Lessons':
    //   return { ...state, chosenLessons: action.chosenLessons, step: 4 };
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
  //   const { dataModalName, storeDispatch } = useStore();
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
                // style={{
                //   display: `${i === state.step ? 'block' : 'none'}`,
                // }}
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
        <Modal.Actions>
          <button
            type="button"
            onClick={() => dispatch({ type: 'Step_Decrease' })}
            disabled={state.step === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'Step_Increase' })}
            disabled={state.step >= numWords + 1}
          >
            Next
          </button>
        </Modal.Actions>
        {/* <SetterProvider>
        {currentStep === 'EDIT_DATA' ? (
          <LessonsData
            closeModal={closeModal}
            dispatch={dispatch}
            chosenLessons={state.chosenLessons}
            grade={
              state.grades.find(grade => grade._id === state.chosenGrade).grade
            }
            publisher={
              state.books[state.chosenGrade].find(
                book => book._id === state.chosenBook
              ).publisher
            }
          />
        ) : currentStep === 'CHOOSE_LESSONS' ? (
          <LessonsLessons
            closeModal={closeModal}
            dispatch={dispatch}
            lessons={state.lessons}
            books={state.books}
            chosenGrade={state.chosenGrade}
            chosenBook={state.chosenBook}
            chosenBookImg={state.chosenBookImg}
          />
        ) : currentStep === 'CHOOSE_BOOK' ? (
          <LessonsBooks
            closeModal={closeModal}
            dispatch={dispatch}
            chosenGrade={state.chosenGrade}
            grades={state.grades}
            books={state.books}
          />
        ) : (
          <LessonsGrades
            closeModal={closeModal}
            dispatch={dispatch}
            currentStep={currentStep}
            grades={state.grades}
          />
        )}
      </SetterProvider> */}
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
