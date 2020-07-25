export const generateId = () => {
	return Date.now().toString(36);
};

export const checkUnhandled = (action: never, returnValue?: any) => {
	if (action) {
		throw new Error(`Unhandled action: ${JSON.stringify(action)}`);
	}
	return returnValue;
};
