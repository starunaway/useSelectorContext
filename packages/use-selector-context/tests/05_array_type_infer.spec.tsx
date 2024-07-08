import React, { useState, StrictMode, SetStateAction, Dispatch, useRef, ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { createContext, useContext } from '../src';

describe('05_basic', () => {
  afterEach(cleanup);

  it('counter', () => {
    const initialState = {
      count1: 0,
      count2: 0,
    };

    type State = typeof initialState;
    const context = createContext<[State, Dispatch<SetStateAction<State>>]>([
      initialState,
      () => null,
    ]);

    const Counter1 = () => {
      const count1 = useContext(context, (v) => v[0].count1);
      const setState = useContext(context, (v) => v[1]);
      const increment = () =>
        setState((s) => ({
          ...s,
          count1: s.count1 + 1,
        }));
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count1: {count1}</span>
          <button type="button" onClick={increment}>
            +1
          </button>
          <span>{renderCount.current}</span>
        </div>
      );
    };

    const Counter2 = () => {
      const count2 = useContext(context, (v) => v[0].count2);
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count2: {count2}</span>
          <span data-testid="counter2">{renderCount.current}</span>
        </div>
      );
    };
    const StateProvider = ({ children }: { children: ReactNode }) => (
      <context.Provider value={useState(initialState)}>{children}</context.Provider>
    );
    const App = () => (
      <StrictMode>
        <StateProvider>
          <Counter1 />
          <Counter2 />
        </StateProvider>
      </StrictMode>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('counter2').textContent).toEqual('1');
    expect(container).toMatchSnapshot();
  });
});
