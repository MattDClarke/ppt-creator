import { useState } from 'react';

export default function useToggleState(initialVal = false) {
  const [state, setState] = useState(initialVal);
  const toggle = () => {
    // dnt set the state var directly
    setState(st => !st);
  };
  // return piece of state and a function to toggle it
  return [state, toggle] as const;
}
