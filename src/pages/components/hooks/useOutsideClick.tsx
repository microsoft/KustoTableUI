import { RefObject, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * @param ref ref to be used in the component.
 * @param callback callback function to be called on outside click.
 * @returns ref to be used in the component.
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (event: any) => void,
) {
  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref?.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  });
}
