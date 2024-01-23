import './styles.scss';
import { PageLoader } from 'components/PageLoader';

interface ITabPanelProps {
  children: React.ReactNode;
  className?: string;
  isHidden: boolean;
  isLoading: boolean;
  loadingMessage?: string;
  tabValue: string;
}

/**
 * Displays children components in a tab panel.
 * @param children The children components.
 * @param className The classname.
 * @param isHidden Is tab hidden.
 * @param isLoading Indicates if the loading message should be displayed.
 * @param loadingMessage The message to display when loading.
 * @param tabValue The tab value.
 * @returns A JSX element.
 */
export function TabPanel({
  children,
  className = '',
  isHidden,
  isLoading,
  loadingMessage = 'Loading...',
  tabValue,
}: ITabPanelProps): JSX.Element {
  return (
    <div
      className={`tab-panel-container ${className}`.trim()}
      role="tabpanel"
      hidden={isHidden}
      id={`scrollable-force-tabpanel-${tabValue}`}
    >
      {isLoading ? <PageLoader message={loadingMessage} /> : children}
    </div>
  );
}
