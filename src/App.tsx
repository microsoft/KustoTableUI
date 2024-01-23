import Pages from './pages';
import { StateProvider } from 'state';

export default function App(): JSX.Element {
  return (
    <StateProvider>
      <Pages />
    </StateProvider>
  );
}
