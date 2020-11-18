import { useMemo } from 'react';

const actionCreatorsCache = new Map<
	Actions.HandlersMap,
	Actions.ActionCreatorsMap<any>
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
			const dispatcher: Actions.ActionCreator<any> = (dispatch) => (
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

const ACTION_TYPE_RE = /^@(?<category>.+)\/(?<name>.*)/;

type ActionTypeExec = Maybe<
	OmitType<RegExpExecArray, 'groups'> & {
		groups: {
			category?: string;
			name: string;
		};
	}
>;

const createDispatch = <T extends Actions.ActionCreatorsMap<any>>(
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

type UseDispatchOptions = {
	dispatch: Actions.BaseDispatch<any>;
	handlers: Actions.HandlersMap;
};

interface UseDispatch {
	(): { dispatch: Store.Dispatch };
	<T extends UseDispatchOptions>(options: T): {
		dispatch: Actions.Dispatch<T['handlers']>;
	};
}

let coreDispatch: Store.Dispatch;
export let useDispatch: UseDispatch;

const init: Store.HookInitializer = (store, coreHandlers) => {
	useDispatch = <T extends UseDispatchOptions>(options?: T) =>
		useMemo(() => {
			if (!options) {
				coreDispatch ||= createDispatch(
					store.dispatch,
					getActionCreators(coreHandlers)
				) as any;

				return { dispatch: coreDispatch };
			}

			return {
				dispatch: createDispatch(
					options.dispatch,
					getActionCreators(options.handlers)
				) as any,
			};
		}, []);
};

export default init;
