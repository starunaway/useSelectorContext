import React, { useState, StrictMode, useRef, memo } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { createContext, useContext } from '../src';

describe('02_re_render', () => {
  afterEach(cleanup);

  it('counter', () => {
    const initialState = {
      count1: 0,
      setCount1: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
      count2: 0,
      setCount2: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
    };
    const context = createContext(initialState);

    const Counter1 = () => {
      const count = useContext(context, (v) => v.count1);
      const setState = useContext(context, (v) => v.setCount1);
      const increment = () => setState((s) => s + 1);

      return (
        <div>
          <span data-testid="counter1">{count}</span>
          <button type="button" onClick={increment}>
            +1
          </button>
        </div>
      );
    };

    const Counter2 = () => {
      const count = useContext(context, (v) => v.count2);

      const renderCount = useRef(0);
      renderCount.current += 1;

      return (
        <div>
          <span>{count}</span>
          <span data-testid="counter2">{renderCount.current}</span>
        </div>
      );
    };

    const MemoCounter2 = memo(() => {
      const count = useContext(context, (v) => v.count2);

      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>{count}</span>
          <span data-testid="memocounter2">{renderCount.current}</span>
        </div>
      );
    });

    const App = () => {
      const [count1, setCount1] = useState(0);
      const [count2, setCount2] = useState(0);
      return (
        <StrictMode>
          <context.Provider
            value={{
              count1,
              setCount1,
              count2,
              setCount2,
            }}
          >
            <Counter1 />
            <Counter2 />
            <MemoCounter2 />
          </context.Provider>
        </StrictMode>
      );
    };

    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('counter1').textContent).toEqual('1');
    // first render add 1, when click trigger re-render,then add 1,so is 3
    expect(screen.getByTestId('counter2').textContent).toEqual('3');
    expect(screen.getByTestId('memocounter2').textContent).toEqual('1');

    expect(container).toMatchSnapshot();
  });
});