import { Alert, AlertColor } from '@mui/material';
import { useState } from 'react';

interface IBannerProps {
  className?: string;
  icon?: React.ReactNode;
  isVisible: boolean;
  message: string | React.ReactChild;
  severity?: AlertColor;
  variant?: 'standard' | 'filled' | 'outlined';
  showButton?: boolean;
}

/**
 * The component to show a banner on top of a page.
 * @param className The style to apply to banner.
 * @param icon The icon to be displayed in front of a banner.
 * @param message The message to be displayed in the banner.
 * @param onClose The handler to check if the close button should be displayed.
 * @param severity The severity of the alert (warning = yellow, error = red).
 * @param variant The variant to use (Standard = transparent, Filled = opaque).
 * @returns A JSX element.
 */
export function Banner({
  className = '',
  icon,
  isVisible,
  message,
  severity,
  variant,
  showButton,
}: IBannerProps): JSX.Element | null {
  const [open, setOpen] = useState(true);
  let onClose;

  if (showButton) {
    onClose = () => {
      setOpen(false);
    };
  }

  return !isVisible ? null : (
    <div
      className={className}
      style={{ display: open && message ? 'block' : 'none' }}
    >
      <Alert
        icon={icon}
        onClose={onClose}
        severity={severity}
        variant={variant}
      >
        {message}
      </Alert>
    </div>
  );
}
