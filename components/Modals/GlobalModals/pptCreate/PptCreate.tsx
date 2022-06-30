import React, { Dispatch, SetStateAction, useReducer } from 'react';
// import { SetterProvider } from 'contexts/setter';
// import { useStore } from 'contexts/store';
import Modal from 'components/Modals/Modal';
import { Word } from 'types';

// import LessonsGrades from './LessonsGrades';
// import LessonsBooks from './LessonsBooks';
// import LessonsLessons from './LessonsLessons';
// import LessonsData from './LessonsData';
// import type { Steps, State, Action } from './Lessons.types';

// const steps: Steps[] = [
//   'LOADING',
//   'CHOOSE_GRADE',
//   'CHOOSE_BOOK',
//   'CHOOSE_LESSONS',
//   'EDIT_DATA',
// ];

// const initialState: State = {
//   step: 0,
//   grades: [],
//   books: {},
//   lessons: {},
//   chosenGrade: '',
//   chosenBook: '',
//   chosenBookImg: '',
//   chosenLessons: [],
// };

// const reducer = (state: State, action: Action): State => {
//   switch (action.type) {
//     case 'Step_Increase':
//       return { ...state, step: state.step + 1 };
//     case 'Step_Decrease':
//       return { ...state, step: state.step - 1 };
//     case 'Set_Grades':
//       return {
//         ...state,
//         step: 1,
//         grades: action.grades,
//       };
//     case 'Set_Books':
//       return {
//         ...state,
//         step: 2,
//         books: { ...state.books, [action.gradeId]: action.books },
//       };
//     case 'Set_Lessons':
//       return {
//         ...state,
//         step: 3,
//         lessons: { ...state.lessons, [action.bookId]: action.lessons },
//       };
//     case 'Choose_Grade':
//       return {
//         ...state,
//         step: 2,
//         chosenGrade: action.chosenGrade,
//       };
//     case 'Choose_Book':
//       return {
//         ...state,
//         chosenBook: action.chosenBook,
//         chosenBookImg: action.chosenBookImg,
//         step: 3,
//       };
//     case 'Choose_Lessons':
//       return { ...state, chosenLessons: action.chosenLessons, step: 4 };
//   }
// };

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

  //   // REDUCER THAT HOLDS THE LOGIC AND INFO FOR THE WHOLE FLOW
  //   const [state, dispatch] = useReducer(reducer, initialState);

  //   // STEP CHECKER
  //   if (state.step < 0 || state.step >= steps.length) {
  //     throw 'Step Threshold Exceeded';
  //   }
  //   const currentStep = steps[state.step];

  return (
    <Modal
      isOpen={pptCreateModalIsOpen}
      closeModal={closeModal}
      style={{ content: { width: 767 } }}
    >
      <Modal.Header closeModal={closeModal}>
        Select images for each word
      </Modal.Header>
      <Modal.Content>
        <div>
          {words.map(word => (
            <div key={word.id}>{word.word}</div>
          ))}
        </div>
      </Modal.Content>
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
  );
}
