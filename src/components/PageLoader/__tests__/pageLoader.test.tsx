import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { PageLoader } from '..';

describe('PageLoader Snapshot UI Tests', () => {
  let component: ReactTestRenderer;

  afterEach(() => component.unmount());

  test.each`
    message
    ${''}
    ${undefined}
    ${'Override The Message...'}
  `('Test PageLoader Rendering $scenario', ({ message }) => {
    component = renderer.create(<PageLoader message={message} />);
    const pageLoader = component.toJSON();
    expect(pageLoader).toMatchSnapshot();
  });
});
