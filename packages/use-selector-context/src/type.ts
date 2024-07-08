import { Context } from 'react';

const Z = Symbol.for('ZContext');

export interface ZContext<Value> {
  [Z]: {};
  Provider: Context<Value>['Provider'];
  Consumer: null;
}

export type ZContextValue<Value = unknown> = {
  getSnapshot: () => Value;
  subscribe: (listener: Listener) => () => void;
};

export type Listener = () => void;

export type EqualityFn<T> = (a: T, b: T) => boolean;
