import React from 'react';
import {useSerialized} from '@shopify/react-html';

import style from './App.scss';

export function App() {
  const [storefrontModules] = useSerialized('storefrontModules');

  return (
    <div className={style.AppContainer}>
      {/* eslint-disable-next-line @shopify/jsx-no-hardcoded-content */}
      <h1 className={style.AppTitle}>Hello World</h1>
      <p>{JSON.stringify(storefrontModules)}</p>
    </div>
  );
}
