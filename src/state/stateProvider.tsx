import React, { createContext, useContext, useReducer } from 'react';
import { Reducers } from './reducers';

const initialState: IState = {
  error: '',
  user: {
    isAuthenticated: null,
    userName: '',
  },
};

// Create a state context for the IStateStore type.
const StateContext = createContext<IStateStore<IState>>({
  dispatch: null,
  state: initialState,
});

interface IStateProviderProps {
  children: React.ReactNode;
}

/**
 * This state provider should be used to register and use this specific
 * state. All components passed in will be able to access this state object.
 * @param children Children components that will be registered/using to
 * this state provider.
 * @returns A JSX Element.
 */
export function StateProvider({ children }: IStateProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(Reducers, initialState);
  const store: IStateStore<IState> = {
    dispatch,
    state,
  };
  return (
    <StateContext.Provider value={store}>{children}</StateContext.Provider>
  );
}

/**
 * This hook allows components that are registered to the state provider
 * easy access to the state object and effects.
 * @returns A state context oject.
 */
export function useStateStore(): IStateContext<IState> {
  const { state } = useContext(StateContext);
  if (!state) {
    throw new Error('The state context is not initialized.');
  }

  return {
    effects: {},
    state,
  };
}
