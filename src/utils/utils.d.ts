import { ConcatImpl } from './concat';

declare global {
	type Maybe<T> = T | undefined | null;

	type OmitType<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

	type KeyOf<T, U extends keyof T> = Extract<keyof T, U>;

	type AnyObject = Record<string | number, any>;

	type AnyFunction = (...args: any[]) => any;

	type Timestamp = number;

	type Concat<
		ArrT extends readonly any[],
		OtherT extends readonly any[]
	> = ConcatImpl<ArrT, OtherT>;
}
