import React, { memo, useMemo, useState } from 'react';
import { useContext, createContext, shallowEqual, useGetSnapshot } from 'use-selector-context';

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
  console.log('child1 render');
  return (
    <div>
      child1,v1:{v1}
      <button onClick={() => setV1?.(v1 + 1)}>setv1</button>
    </div>
  );
});
const Child2 = memo(() => {
  const { v2, setV2 } = useContext(context, (v) => ({ v2: v.v2, setV2: v.setV2 }), shallowEqual);

  console.log('child2 render');
  return <Child22 v2={v2} setV2={setV2} />;
});

const Child22 = memo((props: any) => {
  console.log('child2222 render');
  return (
    <div>
      child2, v2:{props.v2}
      <button onClick={() => props?.setV2?.(props?.v2 + 1)}>setv2</button>
    </div>
  );
});

const Child3 = memo(() => {
  console.log('child3 render');

  const { v3, setV3 } = useContext(context, (v) => ({ v3: v.v3, setV3: v.setV3 }), shallowEqual);
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
  console.log('child4 render');
  const { v3 } = useAppContext((v) => ({ v3: v.v3 }), shallowEqual);

  return <div>child4,v3.length:{v3.length}</div>;
});

const Child5 = memo(() => {
  console.log('child5 render');
  const { v3 } = useAppContext((v) => ({ v3: v.v3 }));

  return <div>child5,v3.length:{v3.length},without shallowEqual</div>;
});

const useGetAppSnapshot = useGetSnapshot.withContext(context);

const Child6 = memo(() => {
  console.log('child6 render');
  const getSnapshot = useGetAppSnapshot();
  const [snapShot, setSnapShot] = useState<ReturnType<typeof getSnapshot> | null>(null);

  return (
    <div>
      <span>getSnapshot:{JSON.stringify(snapShot, null, 2)}</span>
      <button onClick={() => setSnapShot(getSnapshot())}>getSnapshot</button>
    </div>
  );
});

const Child7 = memo(() => {
  console.log('child7 render');

  const getSnapshot = useGetSnapshot(context);

  const [snapShot, setSnapShot] = useState<ReturnType<typeof getSnapshot> | null>(null);

  return (
    <div>
      <span>getSnapshot:{JSON.stringify(snapShot, null, 2)}</span>
      <button onClick={() => setSnapShot(getSnapshot())}>getSnapshot</button>
    </div>
  );
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
      <Child6 />
      <Child7 />
    </context.Provider>
  );
}

export default App;
