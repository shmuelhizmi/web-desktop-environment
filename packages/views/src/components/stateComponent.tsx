import { useState } from "react";

const StateComponent = <State extends object>(props: {
  state: State;
  children: (
    state: State,
    setState: (newState: Partial<State>) => void
  ) => JSX.Element;
}) => {
  const [state, setState] = useState<State>(props.state);
  const updateState = (newState: Partial<State>) => {
    setState({ ...state, ...newState });
  };
  return props.children(state, updateState);
};

export default StateComponent;
