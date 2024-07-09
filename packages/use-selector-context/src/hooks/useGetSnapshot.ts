import { ZContext, ZContextValue } from '../type';
import React, { Context } from 'react';

export interface UseGetSnapshot<Value = unknown> {
  <TState extends Value = Value>(context: ZContext<TState>): () => TState;

  withContext: <TState extends Value = Value>(context: ZContext<TState>) => () => () => TState;
}

function createUseGetSnapshot() {
  const useGetSnapshot: UseGetSnapshot = <Value = unknown, Selected = Value>(
    context: ZContext<Value>
  ) => {
    const { getSnapshot } = React.useContext(context as unknown as Context<ZContextValue<Value>>);

    return getSnapshot;
  };

  const withContext = <Value = unknown>(context: ZContext<Value>) => {
    return () => useGetSnapshot(context);
  };

  useGetSnapshot.withContext = withContext;

  return useGetSnapshot;
}

const useGetSnapshot = createUseGetSnapshot();

export default useGetSnapshot;
