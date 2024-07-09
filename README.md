# useSelectorContext

[![CI](https://img.shields.io/github/actions/workflow/status/starunaway/useSelectorContext/test.yml?branch=main)](https://github.com/starunaway/useSelectorContext/actions?query=workflow%3ACI)
[![npm](https://img.shields.io/npm/v/use-selector-context)](https://www.npmjs.com/package/use-selector-context)
[![size](https://img.shields.io/bundlephobia/minzip/use-selector-context)](https://bundlephobia.com/result?p=use-selector-context)

React useSelectorContext hook, support custom isEqual function.
This hook only depends on React and doesn't require any other external library. This makes it a lightweight and efficient option for managing and using state in your React applications.

## Introduction

React Context and the useContext hook are frequently employed as solutions to circumvent prop drilling. However, it's widely recognized that this approach comes with a performance drawback. Specifically, every time the value of a context changes, all components utilizing the useContext hook will be triggered to re-render.

To solve this issue,
[useSelectorContext](https://github.com/reactjs/rfcs/pull/119)
is proposed and later proposed.

The `useSelectorContext` supports custom `selector` and `isEqual` functions, providing fine-grained control over the conditions that trigger a re-render.

## Install

This package requires react >= 18.

```bash
npm install use-selector-context
# or
yarn add use-selector-context
# or
pnpm add use-selector-context
```

## Technical memo

To make it work like original React context, it uses
[useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore) without any libraries.

Inspiration was drawn from [an example](https://github.com/dai-shi/use-selector-context/issues/109#issuecomment-1785147682).

## Usage

```javascript
import React, { memo, useMemo, useState, createRoot } from 'react';
import { useContext, createContext, shallowEqual } from 'use-selector-context';

const context = createContext<{
  v1: number;
  v2: number;
  v3: number[];
  setV1?: React.Dispatch<React.SetStateAction<number>>;
  setV2?: React.Dispatch<React.SetStateAction<number>>;
  setV3?: React.Dispatch<React.SetStateAction<number[]>>;
}>({
  v1: 0,
  v2: 0,
  v3: [],
});

const Child1 = memo(() => {
  const v1 = useContext(context, (v) => v.v1);
  const setV1 = useContext(context, (v) => v.setV1);
  return (
    <div>
      child1,v1:{v1}
      <button onClick={() => setV1?.(v1 + 1)}>setv1</button>
    </div>
  );
});

const Child2 = memo(() => {
  const { v2, setV2 } = useContext(context, (v) => ({ v2: v.v2, setV2: v.setV2 }), shallowEqual);
  return <Child22 v2={v2} setV2={setV2} />;
});

const Child22 = memo((props: any) => {
  return (
    <div>
      child2, v2:{props.v2}
      <button onClick={() => props?.setV2?.(props?.v2 + 1)}>setv2</button>
    </div>
  );
});

const Child3 = memo(() => {
  const { v3, setV3 } = useContext(context);
  return (
    <div>
      child3,v3.length:{v3.length}
      <button
        onClick={() => {
          setV3?.((v) => [...v, v3.length + 1]);
        }}
      >
        setv3
      </button>
    </div>
  );
});

const useAppContext = useContext.withContext(context);

const Child4 = memo(() => {
  const { v3 } = useAppContext((v) => ({ v3: v.v3 }), shallowEqual);
  return <div>child4,v3.length:{v3.length}</div>;
});

const Child5 = memo(() => {
  const { v3 } = useAppContext();
  return <div>child5,v3.length:{v3.length},no shallowEqual</div>;
});




function App() {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [v3, setV3] = useState<number[]>([]);

  const contextValue = useMemo(() => {
    return { v1, v3, setV1, setV3, v2, setV2 };
  }, [v1, v2, v3]);

  return (
    <context.Provider value={contextValue}>
      <p>render My context app ⬇️ WIP</p>
      <Child1 />
      <Child2 />
      <Child3 />
      <Child4 />
      <Child5 />
    </context.Provider>
  );
}


createRoot(document.getElementById('app')).render(<App />);
```

## API

### createContext

This creates a special context for `useSelectorContext`.

#### Parameters

- `defaultValue` **Value**&#x20;

#### Examples

```javascript
import { createContext } from 'use-selector-context';

const AppContext = createContext({ a: '', b: '' });
```

### useContext

This hook returns context selected value by selector.

`useContext` only accepts contexts created by `createContext`. It initiates a re-render only when the selected value undergoes a referential change.

- By default, `selector` uses the function `(value) => value` to retrieve the value. You have the option to use destructuring to extract data.
- By default, `isEqual` uses `Object.is` for comparison. However, you have the flexibility to use `shallowEqual`(import ) or your own custom `isEqual` function to determine when the selected value has changed.

#### Parameters

- `context` **ZContext\<Value>**&#x20;
- `selector?` **function (value: Value): Selected**&#x20;
- `isEqual?` **function (a: Selected,b: Selected): boolean**&#x20;

#### Examples

```javascript
import { useContext, shallowEqual } from 'use-selector-context';

const a = useContext(AppContext, (state) => state.a);
// or
const b = useContext(AppContext, (state) => {
  b: state.a;
});

// or
const c = useContext(
  AppContext,
  (state) => {
    c: state.a;
  },
  shallowEqual
);
```

### useContext.withContext

Similar to [React Redux useSelector](https://github.com/reduxjs/react-redux/blob/master/src/hooks/useSelector.ts#L263), you can use `useContext.withContext` to specify the context type and to pass in the default parameters for the context.

#### Parameters

- `context` **ZContext\<Value>**&#x20;

#### Examples

```javascript
import { useContext, shallowEqual } from 'use-selector-context';

const useAppContext = useContext.withContext(AppContext);
// or
const a = useAppContext((state) => {
  b: state.a;
});

// or
const c = useAppContext((state) => {
  c: state.a;
}, shallowEqual);
```

### useGetSnapshot

It is used to get the current snapshot of the provided context.

#### Parameters

- `defaultValue` **ZContext<Value>**&#x20;

#### Examples

```javascript
import { useGetSnapshot } from 'use-selector-context';
//  in Component
const getAppContext = useGetSnapshot(AppContext);
```

### useGetSnapshot.withContext

You can use `useGetSnapshot.withContext` to specify the context type and to pass in the default parameters for the context.

#### Parameters

- `defaultValue` **ZContext<Value>**&#x20;

#### Examples

```javascript
import { useGetSnapshot } from 'use-selector-context';

const useGetAppSnapshot = useGetSnapshot.withContext(context);

//  in Component
const getAppContext = useGetAppSnapshot();
```

## Examples

The [example](example) folder contains working examples.
You can run one of them with

```bash
pnpm run example
```

and open <http://localhost:5173> in your browser.

You can also try them directly:
[Online Example](https://stackblitz.com/github/starunaway/useSelectorContext)
