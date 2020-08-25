import { useReducer } from 'react';

export const useForceUpdate = () => {
	const [, forceUpdate] = useReducer((s) => s + 1, 0);
	return { forceUpdate };
};

export const actionHandler = <T extends string, H extends App.Handler<any>>(
	type: T,
	handler: H
) => {
	return [
		type,
		(
			state: App.ImmutableAppState,
			action: App.ActionBase<T, Parameters<H>[1]>
		) => handler(state, (action as App.ActionBase<T, unknown>).payload),
	] as const;
};
