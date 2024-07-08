import React, { useState, StrictMode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { createContext, useContext } from '../src';

describe('01_basic', () => {
  afterEach(cleanup);

  it('counter', () => {
    const initialState = {
      count: 0,
      setCount: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
    };
    const context = createContext(initialState);

    const Counter = () => {
      const count = useContext(context, (v) => v.count);
      const setState = useContext(context, (v) => v.setCount);
      const increment = () => setState((s) => s + 1);

      return (
        <div>
          <span data-testid="counter">{count}</span>
          <button type="button" onClick={increment}>
            +1
          </button>
        </div>
      );
    };

    const App = () => {
      const [count, setCount] = useState(0);

      return (
        <StrictMode>
          <context.Provider
            value={{
              count,
              setCount,
            }}
          >
            <Counter />
          </context.Provider>
        </StrictMode>
      );
    };

    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('counter').textContent).toEqual('1');
    expect(container).toMatchSnapshot();
  });
});
