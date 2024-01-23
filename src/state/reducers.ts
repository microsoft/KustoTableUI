import * as actions from './actions';

/**
 * The state reducer that is called when a state action is called.
 * @param state The current state.
 * @param action The action to take.
 */
export function Reducers(state: IState, action: IAction): IState {
  switch (action.type) {
    case actions.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
    case actions.SET_AUTHENTICATED_USER_CONTEXT:
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.payload.isAuthenticated,
          userName: action.payload.userName,
        },
      };
    default:
      return state;
  }
}
