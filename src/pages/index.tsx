import './styles.scss';
import { Footer, MenuBar } from 'components';
import { Route, Router, Switch } from 'react-router';
import Example1 from './Example1';
import Example2 from './Example2';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

/**
 * A component that contains the pages and their routings.
 * @returns A JSX element.
 */
export default function Pages(): JSX.Element {
  return (
    <Router history={history}>
      <MenuBar title={process.env.REACT_APP_NAME} userName={''} />
      <div className="page-container">
        <Switch>
          <Route path="/Example1" component={Example1} />
          <Route path="/Example2" component={Example2} />
          <Route path="/" component={Example1} />
        </Switch>
      </div>
      <Footer mailTo={''} title={`${process.env.REACT_APP_NAME}`} />
    </Router>
  );
}
