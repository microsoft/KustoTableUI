import './styles.scss';
import { MdCopyright } from 'react-icons/md';

interface IFooterProps {
  mailTo?: string;
  buildVersion?: string;
  title?: string;
}

/**
 * The footer component.
 * @returns A JSX element.
 */
export function Footer({ mailTo, title }: IFooterProps): JSX.Element {
  return (
    <div className="footer-container">
      <div className="footer-container-left">
        <MdCopyright /> 2023 - {title} [
        <a href={`mailto:${mailTo ?? ''}`}>Support</a>]
      </div>
    </div>
  );
}
