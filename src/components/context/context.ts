import { createContext, useContext } from 'react';
import { except } from '../../utils';

import { useAlert } from './useAlert';

export type AppContextValue = {
	showAlert: ReturnType<typeof useAlert>['showAlert'];
};

export const AppContext = createContext<AppContextValue>({
	showAlert: except('App context is not available'),
});

export const useAppContext = () => useContext(AppContext);
