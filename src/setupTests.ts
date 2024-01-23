// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('@azure/msal-browser', () => {
  const mockPCA = jest.fn().mockImplementation(() => {
    return {
      addEventCallback: jest.fn(),
      enableAccountStorageEvents: jest.fn(),
      getActiveAccount: jest.fn().mockImplementation(() => {
        'user';
      }),
      getAllAccounts: jest.fn().mockImplementation(() => []),
    };
  });
  return {
    PublicClientApplication: mockPCA,
  };
});
