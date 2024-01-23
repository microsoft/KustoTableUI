import * as actions from '../actions';
import { Reducers } from '../reducers';

const initialState: IState = {
  error: '',
  user: {
    isAuthenticated: null,
    userName: '',
  },
};

describe('State Tests', () => {
  test('Set Error Message', () => {
    // Arrange.
    const error = 'Test Error';
    const expectedState = JSON.stringify({
      ...initialState,
      error,
    });

    // Act.
    const action = actions.setError(error);
    const state = Reducers(initialState, action);

    // Assert.
    expect(action.payload.error).toEqual(error);
    expect(action.type).toEqual(actions.SET_ERROR);
    expect(JSON.stringify(state)).toEqual(expectedState);
  });

  test('Set User Is Authenticated', () => {
    // Arrange.
    const isAuthenticated = true;
    const expectedState = JSON.stringify({
      ...initialState,
      user: {
        ...initialState.user,
        isAuthenticated,
        userName: 'username',
      },
    });

    // Act.
    const action = actions.setAuthenticatedUserContext(
      isAuthenticated,
      'username',
    );
    const state = Reducers(initialState, action);

    // Assert.
    expect(action.payload.isAuthenticated).toEqual(isAuthenticated);
    expect(JSON.stringify(state)).toEqual(expectedState);
  });
});
