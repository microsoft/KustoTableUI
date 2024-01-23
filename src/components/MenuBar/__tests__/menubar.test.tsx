import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { MenuBar } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

describe('MenuBar Snapshot UI Tests', () => {
  const history = createBrowserHistory();
  let component: ReactTestRenderer;

  afterEach(() => component.unmount());

  test.each`
    title                  | userName       | scenarioName
    ${null}                | ${null}        | ${'Null Title and User Name'}
    ${undefined}           | ${undefined}   | ${'Undefined Title and User Name'}
    ${''}                  | ${''}          | ${'Empty String Title and User Name'}
    ${'Title for the App'} | ${'Test User'} | ${'Normal Title and User Name'}
  `('Test MenuBar Rendering $scenarioName', ({ title, userName }) => {
    component = renderer.create(
      <Router history={history}>
        <MenuBar title={title} userName={userName} />
      </Router>,
    );
    const menuBar = component.toJSON();
    expect(menuBar).toMatchSnapshot();
  });
});
