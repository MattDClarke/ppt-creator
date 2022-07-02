export type State = {
  step: number;
};

export type Action = { type: 'Step_Increase' } | { type: 'Step_Decrease' };

export type Dispatch = React.Dispatch<Action>;

export type Props = {
  closeModal: () => void;
  dispatch: Dispatch;
};
