import React, { useState, StrictMode, useRef, memo } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { createContext, useContext, useGetSnapshot } from '../src';

describe('04_withContext', () => {
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
          <button data-testid="button" onClick={increment}>
            +1
          </button>
        </div>
      );
    };

    const useGetAppSnapshot = useGetSnapshot.withContext(context);
    const MemoCounterA = memo(() => {
      const getSnapshot = useGetAppSnapshot();
      const [snapShot, setSnapShot] = useState<ReturnType<typeof getSnapshot> | null>(null);

      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span data-testid="snapShotA">{snapShot?.count1}</span>
          <button data-testid="btnA" onClick={() => setSnapShot(getSnapshot())}>
            getSnapshot
          </button>
          <span data-testid="memocounterA">{renderCount.current}</span>
        </div>
      );
    });

    const MemoCounterB = memo(() => {
      const getSnapshot = useGetSnapshot(context);
      const [snapShot, setSnapShot] = useState<ReturnType<typeof getSnapshot> | null>(null);

      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span data-testid="snapShotB">{snapShot?.count1}</span>
          <button data-testid="btnB" onClick={() => setSnapShot(getSnapshot())}>
            getSnapshot
          </button>
          <span data-testid="memocounterB">{renderCount.current}</span>
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
            <MemoCounterA />
            <MemoCounterB />
          </context.Provider>
        </StrictMode>
      );
    };

    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByTestId('button'));
    expect(screen.getByTestId('counter1').textContent).toEqual('1');
    expect(screen.getByTestId('memocounterA').textContent).toEqual('1');
    expect(screen.getByTestId('memocounterB').textContent).toEqual('1');
    expect(screen.getByTestId('snapShotA').textContent).toEqual('');
    expect(screen.getByTestId('snapShotB').textContent).toEqual('');

    fireEvent.click(screen.getByTestId('btnA'));
    expect(screen.getByTestId('memocounterA').textContent).toEqual('3');
    expect(screen.getByTestId('memocounterB').textContent).toEqual('1');
    expect(screen.getByTestId('snapShotA').textContent).toEqual('1');
    expect(screen.getByTestId('snapShotB').textContent).toEqual('');

    fireEvent.click(screen.getByTestId('btnB'));
    expect(screen.getByTestId('memocounterA').textContent).toEqual('3');
    expect(screen.getByTestId('memocounterB').textContent).toEqual('3');
    expect(screen.getByTestId('snapShotA').textContent).toEqual('1');
    expect(screen.getByTestId('snapShotB').textContent).toEqual('1');
    expect(container).toMatchSnapshot();
  });
});
