import './styles.scss';
import { Link } from 'react-router-dom';
import logo from './logo.svg';

interface IMenuBarProps {
  title?: string;
  userName?: string;
}

/**
 * The menubar component that controls page navigation.
 * @param title The title to display in the menubar.
 * @param userName The user's username to display in the menubar.
 * @returns A JSX element.
 */
export function MenuBar({ title, userName }: IMenuBarProps): JSX.Element {
  return (
    <div className="menubar-container">
      <div className="menubar-container-left">
        <Link className="menubar-title" to="/home">
          <img src={logo} className="menubar-icon" alt="logo" />
          {title ?? ''}
        </Link>
        <Link className="menubar-item-link" to="/Example1">
          Example1
        </Link>
        <Link className="menubar-item-link" to="/Example2">
          Example2
        </Link>
      </div>
      <div className="menubar-container-right">
        <>
          <span className="menubar-username">{userName}</span>
        </>
      </div>
    </div>
  );
}
