import { useMemo } from 'react';

const actionCreatorsCache = new Map<
	Actions.AnyHandlers,
	Actions.ActionCreatorsMap
>();

const getActionCreators = <
	T extends AnyObject,
	R extends Actions.ActionCreatorsMap<T>
>(
	handlers: T
) => {
	const match = actionCreatorsCache.get(handlers);
	if (match) return match as R;

	const actionCreators = (Object.keys(handlers) as (keyof R)[]).reduce(
		(result, type) => {
			const dispatcher: Actions.ActionCreator = (dispatch) => (
				payload
			) => {
				dispatch({ type, payload });
			};
			result[type] = dispatcher as any;
			return result;
		},
		{} as R
	);

	actionCreatorsCache.set(handlers, actionCreators);
	return actionCreators;
};

const prepareThunks = <
	T extends Actions.AnyThunks,
	R extends Actions.ThunksMap<T>
>(
	thunks: T,
	dispatch: Store.Dispatch
) => {
	return (Object.entries(thunks) as [keyof T, T[keyof T]][]).reduce(
		(result, [name, fn]) => {
			result[name] = fn({ dispatch }) as R[keyof T];
			return result;
		},
		{} as R
	);
};

const ACTION_TYPE_RE = /^@(?<category>.+)\/(?<name>.*)/;

type ActionTypeExec = Maybe<
	OmitType<RegExpExecArray, 'groups'> & {
		groups: {
			category?: string;
			name: string;
		};
	}
>;

const createDispatch = <T extends Actions.ActionCreatorsMap>(
	dispatch: Actions.BaseDispatch<any>,
	actionCreators: T
) =>
	(Object.keys(actionCreators) as (string & keyof T)[]).reduce(
		(result, type) => {
			const match = ACTION_TYPE_RE.exec(type) as ActionTypeExec;

			if (match && match.groups.category) {
				const {
					groups: { category, name },
				} = match;
				(result[category] ||= {})[name] = actionCreators[type](
					dispatch
				);
			} else {
				result[type] = actionCreators[type](dispatch);
			}

			return result;
		},
		{} as AnyObject
	) as Actions.Dispatch<T>;

type CoreDispatchOptions = {
	thunks?: Actions.AnyThunks;
};

type CustomDispatchOptions = {
	dispatch: Actions.BaseDispatch<any>;
	handlers: Actions.AnyHandlers;
};

type DispatchWithThunks<T extends Actions.AnyThunks> = Store.Dispatch & {
	thunks: Actions.ThunksMap<T>;
};

type UseDispatch = <T extends CoreDispatchOptions>(
	options?: T
) => {
	dispatch: T extends Required<CoreDispatchOptions>
		? DispatchWithThunks<T['thunks']>
		: Store.Dispatch;
};

type UseCustomDispatch = <T extends CustomDispatchOptions>(
	options: T
) => {
	dispatch: Actions.Dispatch<T['handlers']>;
};

export let useDispatch: UseDispatch;
export let useCustomDispatch: UseCustomDispatch;

let coreDispatch: Store.Dispatch;

const init: Store.HookInitializer = (store, coreHandlers) => {
	// TODO: single hook
	useDispatch = <T extends CoreDispatchOptions>(options = {} as T) =>
		useMemo(() => {
			let dispatch: Store.Dispatch;

			dispatch = coreDispatch ||= createDispatch(
				store.dispatch,
				getActionCreators(coreHandlers)
			) as any;

			// TODO: cache thunks
			if (options.thunks) {
				const dispatchWithThunks: DispatchWithThunks<NonNullable<
					T['thunks']
				>> = {
					...dispatch,
					thunks: prepareThunks(options.thunks, coreDispatch),
				};

				dispatch = dispatchWithThunks;
			}

			return { dispatch: dispatch as any };
		}, []);

	useCustomDispatch = <T extends CustomDispatchOptions>(options: T) =>
		useMemo(() => {
			return {
				dispatch: createDispatch(
					options.dispatch,
					getActionCreators(options.handlers)
				) as Actions.Dispatch<T['handlers']>,
			};
		}, []);
};

export default init;
