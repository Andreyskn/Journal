export {};

declare global {
	type Maybe<T> = T | undefined | null;

	type Action<T extends string | number, P = undefined> = P extends undefined
		? { type: T }
		: { type: T; payload: P };

	type OmitType<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

	type KeyOf<T, U extends keyof T> = Extract<keyof T, U>;

	type Updater<T> = (data: T) => T;

	type AnyObject = Record<string | number, any>;

	type RecordType =
		| 'task'
		| 'task-list'
		| 'tab'
		| 'tasks-state'
		| 'tabs-state';

	type TypedRecord<O extends AnyObject, T extends RecordType> = O & {
		_type: T;
	};

	type Stringified<T extends { toString: () => string }> = ReturnType<
		T['toString']
	>;

	type Reducer<S, A extends AppAction> = (state: S, action: A) => S;
}
