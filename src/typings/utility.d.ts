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

	type TypedObject<D extends AnyObject, T extends string> = D & {
		_type: T;
	};

	type Stringified<
		T extends { toString: (...args: any[]) => string }
	> = ReturnType<T['toString']>;
}
