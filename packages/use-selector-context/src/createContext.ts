import React, { ReactNode, Provider, useRef, useLayoutEffect } from 'react';
import { Listener, ZContext, ZContextValue } from './type';

function createSubscribe(listeners: Set<Listener>) {
  return function subscribe(listener: Listener) {
    listeners.add(listener);
    return function unsubscribe() {
      listeners.delete(listener);
    };
  };
}

function createProvider<Value>(originProvider: Provider<ZContextValue<Value>>) {
  const ContextProvider = ({ value, children }: { value: Value; children: ReactNode }) => {
    const contextValue = useRef<ZContextValue<Value>>();

    const realValue = useRef<Value>(value);
    const listeners = useRef(new Set<Listener>());

    if (!contextValue.current) {
      contextValue.current = {
        getSnapshot: () => realValue.current,
        subscribe: createSubscribe(listeners.current),
      };
    }

    useLayoutEffect(() => {
      realValue.current = value;
      listeners.current.forEach((listener) => listener());
    }, [value]);

    return React.createElement(originProvider, { value: contextValue.current }, children);
  };

  return ContextProvider as ZContext<Value>['Provider'];
}

export default function createContext<Value>(defaultValue: Value) {
  const contextValue: ZContextValue<Value> = {
    getSnapshot: () => defaultValue,
    subscribe: {} as any,
  };

  const context = React.createContext<ZContextValue<Value>>(contextValue);

  (context as any).Provider = createProvider(context.Provider);

  return context as unknown as ZContext<Value>;
}
