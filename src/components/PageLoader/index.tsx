import './styles.scss';
import { CircularProgress } from '@mui/material';

interface IPageLoader {
  message?: string;
}

/**
 * Displays a loading icon.
 * @param message The message to display when loading.
 * @returns A JSX element.
 */
export function PageLoader({
  message = 'Loading...',
}: IPageLoader): JSX.Element {
  return (
    <div className="page-loader">
      <CircularProgress />
      <div>{message}</div>
    </div>
  );
}
