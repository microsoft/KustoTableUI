import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { Banner } from '..';
import StarIcon from '@mui/icons-material/Star';

describe('Banner Snapshot UI Tests', () => {
  const testMessage = <span>Show an element</span>;
  const testIcon = <StarIcon fontSize="inherit" sx={{ mr: -1 }} />;
  let component: ReactTestRenderer;

  afterEach(() => component.unmount());

  test.each`
    icon         | message                                           | severity     | variant       | showButton   | isVisible    | scenarioName
    ${undefined} | ${'This is a test message.'}                      | ${'success'} | ${'standard'} | ${true}      | ${true}      | ${'undefined Icon'}
    ${testIcon}  | ${testMessage}                                    | ${'info'}    | ${'standard'} | ${false}     | ${true}      | ${'React Nodes for Icon and Message'}
    ${undefined} | ${'All the props are set to null for this test.'} | ${undefined} | ${undefined}  | ${undefined} | ${undefined} | ${'All Props default'}
  `(
    'Test Banner Display $scenarioName',
    ({ icon, message, severity, variant, showButton, isVisible }) => {
      const testProps: any = {
        icon,
        isVisible,
        message,
        severity,
        showButton,
        variant,
      };
      component = renderer.create(<Banner {...testProps} />);
      const banner = component.toJSON();
      expect(banner).toMatchSnapshot();
    },
  );
});
