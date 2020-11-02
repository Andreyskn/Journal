import { IconName, MaybeElement } from '@blueprintjs/core';

type Side<T extends CSSSide> = Record<T, ViewportRelativeUnits>;

declare global {
	type Maybe<T> = T | undefined | null;

	type OmitType<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

	type ExcludeType<T, U extends T> = T extends U ? never : T;

	type ExtractType<T, U extends T> = T extends U ? T : never;

	type KeyOf<T, U extends keyof T> = Extract<keyof T, U>;

	type AnyObject = Record<string | number, any>;

	type AnyFunction = (...args: any[]) => any;

	type Timestamp = number;

	type Path = string;

	type IconType = IconName | MaybeElement;

	type Pixels = number;

	type ViewportRelativeUnits = number;

	type HorizontalCSSSide = keyof Pick<CSSStyleDeclaration, 'left' | 'right'>;
	type VerticalCSSSide = keyof Pick<CSSStyleDeclaration, 'top' | 'bottom'>;
	type CSSSide = HorizontalCSSSide | VerticalCSSSide;

	type Left = Side<'left'>;
	type Right = Side<'right'>;
	type Top = Side<'top'>;
	type Bottom = Side<'bottom'>;

	type HorizontalPosition = Right | Left;
	type VerticalPosition = Top | Bottom;
	type Position = HorizontalPosition & VerticalPosition;
	type PartialPosition = Partial<Left & Right & Top & Bottom>;
}
