import { Dispatch as ReduxDispatch } from 'redux';
import { Dispatch as ReactDispatch } from 'react';

declare global {
	namespace Actions {
		type ActionBase<
			T extends string | number | symbol,
			P = undefined
		> = P extends undefined
			? { type: T }
			: {
					type: T;
					payload: P;
			  };

		type AnyAction = ActionBase<any, any>;

		type ExtractActions<T extends AnyObject> = {
			[K in keyof T]: ActionBase<K, Parameters<T[K]>[1]>;
		}[keyof T];

		type BaseDispatch<A extends AnyAction = Store.Action> =
			| ReduxDispatch<A>
			| ReactDispatch<A>;

		type Thunk<
			T extends any[] = undefined[],
		> = (deps: { dispatch: Store.Dispatch }) => (...args: T) => void; // TODO: getState

		type AnyThunks = Record<string, Thunk<any[]>>

		type ThunksMap<T extends AnyThunks> = {
			[K in keyof T]: ReturnType<T[K]>;
		};

		type Handler<
			P extends AnyObject | undefined = undefined,
			S extends AnyObject = Store.State
		> = P extends undefined ? (state: S) => S : (state: S, payload: P) => S;

		type AnyHandlers = Record<string, Actions.Handler<any, any>>;

		type ActionCreator<T = undefined, A extends AnyAction = AnyAction> = (
			dispatch: Actions.BaseDispatch<A>
		) => ActionCaller<T>;

		type ActionCaller<P = unknown, T extends string = any> = { type: T } & ((payload: P) => void);

		type ActionCreatorsMap<T extends AnyHandlers = AnyHandlers> = {
			[K in keyof T]: ActionCreator<Parameters<T[K]>[1]>;
		};

		type Dispatch<T extends AnyHandlers = AnyHandlers> = UnionToIntersection<{
			[Key in keyof T as 0]: Key extends `@${infer Category}/${infer Name}`
				? Category extends SystemDispatchCategory 
					? never
					: { [C in Category]: { [N in Name]: ReturnType<ActionCreatorsMap<T>[Key]> } }
				: { [K in Key]: ReturnType<ActionCreatorsMap<T>[Key]>}
		}[0]>

		type SystemDispatchCategory = 'system';

		type SystemActionType<T extends string = string> = `@${SystemDispatchCategory}/${T}`;
	}
}
