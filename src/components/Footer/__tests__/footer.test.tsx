import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { Footer } from '..';

describe('Footer Snapshot UI Tests', () => {
  let component: ReactTestRenderer;

  afterEach(() => component.unmount());

  test.each`
    buildVersion     | mailTo               | title             | scenarioName
    ${null}          | ${null}              | ${null}           | ${'Null BuildVersion, MailTo and Title'}
    ${undefined}     | ${undefined}         | ${undefined}      | ${'Undefined BuildVersion, MailTo and Title'}
    ${''}            | ${''}                | ${''}             | ${'Empty String BuildVersion, MailTo and Title'}
    ${'123.123.134'} | ${'email@email.com'} | ${'KustoTableUI'} | ${'Normal BuildVersion, MailTo and Title'}
  `(
    'Test Footer Rendering $scenarioName',
    ({ buildVersion, mailTo, title }) => {
      component = renderer.create(
        <Footer buildVersion={buildVersion} mailTo={mailTo} title={title} />,
      );
      const footer = component.toJSON();
      expect(footer).toMatchSnapshot();
    },
  );
});
