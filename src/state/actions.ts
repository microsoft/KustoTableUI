export const SET_ERROR = 'SET_ERROR';
export const SET_AUTHENTICATED_USER_CONTEXT = 'SET_AUTHENTICATED_USER_CONTEXT';

/**
 * Creates an action that contains a value indicating whether the user is authenticated.
 * @param isAuthenticated A value indicating whether the user is authenticated.
 * @returns An action object that is used to set user's authentication state.
 */
export function setAuthenticatedUserContext(
  isAuthenticated: boolean,
  userName: string,
): IAction {
  return {
    payload: { isAuthenticated, userName },
    type: SET_AUTHENTICATED_USER_CONTEXT,
  };
}

/**
 * Creates an action for when an error occurs we set it in the state.
 * @param error The error message.
 * @returns An action object that is used to set the error message.
 */
export function setError(error: string): IAction {
  return {
    payload: {
      error,
    },
    type: SET_ERROR,
  };
}
