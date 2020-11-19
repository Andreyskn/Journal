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
			const actionCreator: Actions.ActionCreator = (dispatch) => {
				const actionCaller: Actions.ActionCaller = (payload) => {
					dispatch({ type, payload });
				};
				actionCaller.type = type;
				return actionCaller;
			};
			result[type] = actionCreator as any;
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

type EnhancedDispatch<T = AnyObject> = {
	enhancedDispatch: T;
	enhancedDispatchProxy: T;
};

// pass thunks here?
const createEnhancedDispatch = <T extends Actions.ActionCreatorsMap>(
	baseDispatch: Actions.BaseDispatch<any>,
	actionCreators: T,
	actionProxyHandler: ActionProxyHandler
) =>
	(Object.keys(actionCreators) as (string & keyof T)[]).reduce(
		(result, type) => {
			const { enhancedDispatch, enhancedDispatchProxy } = result;
			const match = ACTION_TYPE_RE.exec(type) as ActionTypeExec;
			const actionCaller = actionCreators[type](baseDispatch);
			const actionCallerProxy = new Proxy(
				actionCaller,
				actionProxyHandler
			);

			// TODO: should always match name and optionally category
			if (match && match.groups.category) {
				const {
					groups: { category, name },
				} = match;

				(enhancedDispatch[category] ||= {})[name] = actionCaller;
				(enhancedDispatchProxy[category] ||= {})[
					name
				] = actionCallerProxy;
			} else {
				enhancedDispatch[type] = actionCaller;
				enhancedDispatchProxy[type] = actionCallerProxy;
			}

			return result;
		},
		{ enhancedDispatch: {}, enhancedDispatchProxy: {} } as EnhancedDispatch
	) as EnhancedDispatch<Actions.Dispatch<T>>;

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
	batch: Batch;
};

type UseCustomDispatch = <T extends CustomDispatchOptions>(
	options: T
) => {
	dispatch: Actions.Dispatch<T['handlers']>;
};

export let useDispatch: UseDispatch;
export let useCustomDispatch: UseCustomDispatch;

let coreDispatch: Store.Dispatch;
let coreBatch: Batch;

type GetBatcher = (
	store: Store.Store
) => {
	batcher: Batcher;
	actionProxyHandler: ActionProxyHandler;
};
type Batcher = (dispatchProxy: Store.Dispatch) => Batch;
type Batch = (batchCalls: (dispatchProxy: Store.Dispatch) => void) => void;
type ActionProxyHandler = ProxyHandler<ReturnType<Actions.ActionCreator<any>>>;

const getBatcher: GetBatcher = (store) => {
	const actions = new Set<Store.Action>();

	const actionProxyHandler: ActionProxyHandler = {
		apply: ({ type }, _, [payload]) => {
			actions.add({ type, payload });
		},
	};

	const batcher: Batcher = (dispatchProxy) => (batchCalls) => {
		batchCalls(dispatchProxy);
		store.dispatch({
			type: '@system/batchDispatch',
			payload: { actions: Array.from(actions.values()) },
		});
		actions.clear();
	};

	return { batcher, actionProxyHandler };
};

const init: Store.HookInitializer = (store, coreHandlers) => {
	const { batcher, actionProxyHandler } = getBatcher(store);

	// TODO: single hook
	useDispatch = <T extends CoreDispatchOptions>(options = {} as T) =>
		useMemo(() => {
			let dispatch = coreDispatch;

			if (!coreDispatch) {
				const {
					enhancedDispatch,
					enhancedDispatchProxy,
				} = createEnhancedDispatch(
					store.dispatch,
					getActionCreators(coreHandlers),
					actionProxyHandler
				);

				dispatch = coreDispatch = enhancedDispatch as any;
				coreBatch = batcher(enhancedDispatchProxy as any);
			}

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

			return { dispatch: dispatch as any, batch: coreBatch };
		}, []);

	useCustomDispatch = <T extends CustomDispatchOptions>(options: T) =>
		useMemo(() => {
			const { enhancedDispatch } = createEnhancedDispatch(
				options.dispatch,
				getActionCreators(options.handlers),
				actionProxyHandler
			);

			return {
				dispatch: enhancedDispatch as Actions.Dispatch<T['handlers']>,
			};
		}, []);
};

export default init;
