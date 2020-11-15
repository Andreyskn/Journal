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

		type Dispatcher<
			T extends any[] = undefined[],
			A extends AnyAction = Store.Action
		> = (deps: { dispatch: BaseDispatch<A> }) => (...args: T) => void;

		type DispatcherMap<T extends Record<string, Dispatcher<any[], any>>> = {
			[K in keyof T]: ReturnType<T[K]>;
		};

		type Handler<
			P extends AnyObject | undefined = undefined,
			S extends AnyObject = Store.State
		> = P extends undefined ? (state: S) => S : (state: S, payload: P) => S;

		type HandlersMap = Record<string, Actions.Handler<any, any>>;

		type ActionCreator<T> = (
			dispatch: Actions.BaseDispatch<any>
		) => (payload: T) => void;

		type ActionCreatorsMap<T extends HandlersMap> = {
			[K in keyof T]: ActionCreator<Parameters<T[K]>[1]>;
		};

		type Dispatch<T extends HandlersMap> = UnionToIntersection<{
			[Key in keyof T as 0]: Key extends `@${infer Category}/${infer Name}`
				? { [C in Category]: { [N in Name]: ReturnType<ActionCreatorsMap<T>[Key]> } }
				: { [K in Key]: ReturnType<ActionCreatorsMap<T>[Key]>}
		}[0]>
	}
}
