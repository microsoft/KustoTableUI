import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { createRef } from 'react';
import { useOutsideClick } from '../useOutsideClick';

describe('useOutsideClick', () => {
  it('calls handler when click is outside element', () => {
    // Arrange
    const handler = jest.fn();
    const ref = createRef<HTMLDivElement>();
    render(<div ref={ref}></div>);

    // Act
    renderHook(() => useOutsideClick(ref, handler));
    fireEvent.click(document);

    // Assert
    expect(handler).toBeCalledTimes(1);
  });

  it(`doesn't calls handler when click is within element`, () => {
    // Arrange
    const handler = jest.fn();
    const ref = createRef<HTMLDivElement>();
    render(<div ref={ref} data-testid="element-testid"></div>);

    // Act
    renderHook(() => useOutsideClick(ref, handler));
    fireEvent.click(screen.getByTestId('element-testid'));

    //  Assert
    expect(handler).not.toBeCalled();
  });
});
