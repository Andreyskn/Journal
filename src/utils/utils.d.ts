export {};

declare global {
	type Maybe<T> = T | undefined | null;

	type OmitType<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

	type ExcludeType<T, U extends T> = T extends U ? never : T;

	type KeyOf<T, U extends keyof T> = Extract<keyof T, U>;

	type AnyObject = Record<string | number, any>;

	type AnyFunction = (...args: any[]) => any;

	type Timestamp = number;

	type Path = string;
}
