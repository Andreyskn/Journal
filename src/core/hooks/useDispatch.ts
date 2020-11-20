import { useMemo } from 'react';

export let useDispatch: UseDispatch;

type AnyEnhancedDispatch = any;

type Options<
	D extends Actions.BaseDispatch = Actions.BaseDispatch,
	H extends Actions.AnyHandlers = Actions.AnyHandlers
> = {
	dispatch: D;
	handlers: H;
};

type DefaultOptions = Options<Store.Store['dispatch'], Store.Handlers>;

type UseDispatch = <
	T extends Maybe<Actions.AnyThunks>,
	O extends Options | undefined = DefaultOptions
>(
	thunks?: T,
	options?: O
) => {
	dispatch: T extends NonNullable<T>
		? Actions.DispatchWithThunks<
				Actions.Dispatch<NonNullable<O>['handlers']>,
				T
		  >
		: Actions.Dispatch<NonNullable<O>['handlers']>;
} & (O extends DefaultOptions
	? {
			batch: Store.BatchDispatch;
	  }
	: {});

type ActionProxyHandler = ProxyHandler<Actions.ActionCaller<any>>;

const cache = {
	actionCreators: new Map<Actions.AnyHandlers, Actions.ActionCreatorsMap>(),
	thunks: new Map<Actions.AnyThunks, Actions.ThunksMap>(),
};

const getActionCreators = <
	T extends Actions.AnyHandlers,
	R extends Actions.ActionCreatorsMap<T>
>(
	handlers: T
) => {
	const cached = cache.actionCreators.get(handlers);
	if (cached) return cached as R;

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

	cache.actionCreators.set(handlers, actionCreators);
	return actionCreators;
};

const maybeAppendThunks = <T extends Maybe<Actions.AnyThunks>, D>(
	thunks: T,
	dispatch: D
) => {
	if (!thunks) return dispatch;

	return {
		...(dispatch as AnyObject),
		thunks: getActiveThunks(thunks as NonNullable<T>, dispatch),
	} as Actions.DispatchWithThunks<D, NonNullable<T>>;
};

const getActiveThunks = <
	T extends Actions.AnyThunks,
	R extends Actions.ThunksMap<T>
>(
	thunks: T,
	dispatch: AnyEnhancedDispatch
) => {
	const cached = cache.thunks.get(thunks);
	if (cached) return cached as R;

	const activeThunks = (Object.entries(thunks) as [
		keyof T,
		T[keyof T]
	][]).reduce((result, [name, fn]) => {
		result[name] = fn({ dispatch, batch }) as R[keyof T];
		return result;
	}, {} as R);

	cache.thunks.set(thunks, activeThunks);
	return activeThunks;
};

const ACTION_TYPE_RE = /^(?:(?<category>.+)\/)?(?<name>.+)/;

type ActionTypeExec = OmitType<RegExpExecArray, 'groups'> & {
	groups: {
		category?: string;
		name: string;
	};
};

type EnhancedDispatch<T = AnyEnhancedDispatch> = {
	enhancedDispatch: T;
	enhancedDispatchProxy: T;
};

const createEnhancedDispatch = <T extends Actions.ActionCreatorsMap>(
	baseDispatch: Actions.BaseDispatch,
	actionCreators: T,
	actionProxyHandler: ActionProxyHandler
) =>
	(Object.keys(actionCreators) as (string & keyof T)[]).reduce(
		(result, type) => {
			const { enhancedDispatch, enhancedDispatchProxy } = result;
			const {
				groups: { category, name },
			} = (ACTION_TYPE_RE.exec(type) as any) as ActionTypeExec;
			const actionCaller = actionCreators[type](baseDispatch);
			const actionCallerProxy = new Proxy(
				actionCaller,
				actionProxyHandler
			);

			(category ? (enhancedDispatch[category] ||= {}) : enhancedDispatch)[
				name
			] = actionCaller;
			(category
				? (enhancedDispatchProxy[category] ||= {})
				: enhancedDispatchProxy)[name] = actionCallerProxy;

			return result;
		},
		{ enhancedDispatch: {}, enhancedDispatchProxy: {} } as EnhancedDispatch
	) as EnhancedDispatch<Actions.Dispatch<T>>;

let coreDispatch: Store.Dispatch;
let batch: Store.BatchDispatch;

const init: Store.HookInitializer = (store, coreHandlers) => {
	const batchedActions = new Set<Store.Action>();

	const actionProxyHandler: ActionProxyHandler = {
		apply: ({ type }, _, [payload]) => {
			batchedActions.add({ type, payload });
		},
	};

	const getBatch = (dispatchProxy: Store.Dispatch): Store.BatchDispatch => (
		batchDispatch
	) => {
		batchDispatch(dispatchProxy);
		store.dispatch({
			type: 'system/batchDispatch',
			payload: { actions: Array.from(batchedActions.values()) },
		});
		batchedActions.clear();
	};

	const defaultOptions: Options = {
		dispatch: store.dispatch,
		handlers: coreHandlers,
	};

	useDispatch = <T extends Maybe<Actions.AnyThunks>, O extends Options>(
		thunks: T,
		options = defaultOptions as O
	) =>
		useMemo(() => {
			let dispatch: AnyEnhancedDispatch = coreDispatch;

			if (!coreDispatch) {
				const {
					enhancedDispatch,
					enhancedDispatchProxy,
				} = createEnhancedDispatch(
					store.dispatch,
					getActionCreators(coreHandlers),
					actionProxyHandler
				) as EnhancedDispatch;

				dispatch = coreDispatch = enhancedDispatch;
				batch = getBatch(enhancedDispatchProxy);
			}

			if (options !== defaultOptions) {
				const { enhancedDispatch } = createEnhancedDispatch(
					options.dispatch,
					getActionCreators(options.handlers),
					actionProxyHandler
				);

				dispatch = enhancedDispatch;
			}

			return {
				dispatch: maybeAppendThunks(thunks, dispatch),
				batch,
			} as any;
		}, []);
};

export default init;
