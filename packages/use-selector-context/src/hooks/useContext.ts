import { EqualityFn, ZContext, ZContextValue } from '../type';
import React, { Context, useMemo, useSyncExternalStore } from 'react';

type SelectorFn<Value, Selected> = (value: Value) => Selected;

export interface UseContext<Value = unknown> {
  <TState extends Value = Value, Selected = TState>(
    context: ZContext<TState>,
    selector?: (value: TState) => Selected,
    isEqual?: EqualityFn<Selected>
  ): Selected;

  <TState extends Value = Value, Selected = TState>(
    context: ZContext<TState>,
    selector?: (value: TState) => Selected
  ): Selected;

  <TState extends Value = Value>(context: ZContext<TState>): TState;

  withContext: <Value = unknown>(
    context: ZContext<Value>
  ) => <Selected = Value>(
    selector?: SelectorFn<Value, Selected>,
    isEqual?: EqualityFn<Selected>
  ) => Selected;
}

function createUseContextHook() {
  const useContext: UseContext = <Value = unknown, Selected = Value>(
    context: ZContext<Value>,
    selector?: (value: Value) => Selected,
    isEqual?: EqualityFn<Selected>
  ) => {
    const { getSnapshot, subscribe } = React.useContext(
      context as unknown as Context<ZContextValue<Value>>
    );

    selector = selector || ((v: Value) => v as unknown as Selected);

    const getSnapshotWithSelector = useMemo(() => {
      let preValue = getSnapshot();
      let preSelected = selector(preValue);

      return function () {
        const curValue = getSnapshot();
        if (Object.is(preValue, curValue)) {
          // The snapshot is the same as last time. Reuse the previous selection.
          return preSelected;
        }
        const curVelected = selector(curValue);
        if (isEqual?.(preSelected, curVelected)) {
          // The selected value is the same as last time. Reuse the previous selection.

          return preSelected;
        }

        preValue = curValue;
        preSelected = curVelected;

        return curVelected;
      };
    }, [isEqual, selector]);

    const selectedState = useSyncExternalStore(subscribe, getSnapshotWithSelector);

    return selectedState;
  };

  const withContext = <Value = unknown>(context: ZContext<Value>) => {
    return <Selected = Value>(
      selector?: SelectorFn<Value, Selected>,
      isEqual?: EqualityFn<Selected>
    ) => {
      return useContext(context, selector, isEqual);
    };
  };

  useContext.withContext = withContext;

  return useContext;
}

const useContext = createUseContextHook();

export default useContext;
