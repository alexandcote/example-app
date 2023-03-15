import React from 'react';
import {createRoot} from 'react-dom/client';
import {showPage} from '@shopify/react-html';
import {App} from 'foundation/App';

const container = document.querySelector('#app') as HTMLElement;
const root = createRoot(container);

function renderApp() {
  root.render(<App />);
}

renderApp();
showPage();
