import { Color } from 'react-color-palette';

export type selectedImg = {
  step: number;
  word: string;
  img: string;
  translation: string;
  originalImgWidth: number;
  originalImgHeight: number;
  triggerDownloadAPI: string;
};

type layoutOption = {
  type: string;
  label: string;
};

export type pptOptions = {
  fontFace: string;
  bold: boolean;
  italic: boolean;
  color: Color;
  backgroundColor: Color;
  layoutTypes?: layoutOption[];
};

export type State = {
  title: string;
  step: number;
  selectedImgs: selectedImg[];
  pptOptions: pptOptions;
};

export type Action =
  | { type: 'Step_Increase' }
  | { type: 'Step_Decrease' }
  | {
      type: 'Add_Ppt_Options';
      fontFace: string;
      bold: boolean;
      italic: boolean;
      color: Color;
      backgroundColor: Color;
    }
  | {
      type: 'Add_Img_Unsplash';
      step: number;
      img: string;
      originalImgWidth: number;
      originalImgHeight: number;
      triggerDownloadAPI: string;
    }
  | {
      type: 'Add_Optimized_Imgs';
      optimizedImgs: selectedImg[];
    };

export type Dispatch = React.Dispatch<Action>;

export type Props = {
  closeModal: () => void;
  dispatch: Dispatch;
};
