import React, { createContext, useContext } from 'react';
import { except } from '../../utils';

import { useAlert } from './useAlert';

type AppContextValue = {
	showAlert: ReturnType<typeof useAlert>['showAlert'];
};

const AppContext = createContext<AppContextValue>({
	showAlert: except('App context is not available'),
});

export const useAppContext = () => useContext(AppContext);

export const useAppContextProvider = () => {
	const { Alert, showAlert } = useAlert();

	const contextValue: AppContextValue = {
		showAlert,
	};

	const AppContextProvider: React.FC = ({ children }) => {
		return (
			<AppContext.Provider value={contextValue}>
				<Alert />
				{children}
			</AppContext.Provider>
		);
	};

	return { AppContextProvider };
};
