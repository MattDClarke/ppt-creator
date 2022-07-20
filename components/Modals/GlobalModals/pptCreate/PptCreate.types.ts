export type selectedImg = {
  step: number;
  word: string;
  img: string | null;
  translation: string | null;
  originalImgWidth: number | null;
  originalImgHeight: number | null;
  triggerDownloadAPI: string | null;
};

export type State = {
  title: string;
  step: number;
  selectedImgs: selectedImg[];
};

export type Action =
  | { type: 'Step_Increase' }
  | { type: 'Step_Decrease' }
  | {
      type: 'Add_Img_Unsplash';
      step: number;
      img: string;
      originalImgWidth: number;
      originalImgHeight: number;
      triggerDownloadAPI: string;
    };

export type Dispatch = React.Dispatch<Action>;

export type Props = {
  closeModal: () => void;
  dispatch: Dispatch;
};
