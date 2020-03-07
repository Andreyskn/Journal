import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { reducer } from './reducer';

const devTools = devToolsEnhancer({ name: 'Journal' });

export const store = createStore(reducer, devTools);
