type Modifiers = Record<string, any>;

type Handler = (modifiers?: Maybe<Modifiers>, ...extraClasses: unknown[]) => string;

type ValidateElements<E extends Array<string> | ReadonlyArray<string>> = 
	E extends undefined
		? { 'ok': true }
		: E extends Array<string> & ReadonlyArray<string>
			? { error: 'Array of elements should be readonly' }
			: { 'ok': true }

type ToCamelCase<T> = T extends `${infer P1}-${infer P2}`
	? `${P1}${Capitalize<P2>}`
	: T extends string
	? T
	: never

type ProcessArgs<B extends string, E extends Array<string> | ReadonlyArray<string>> =
	{ [K in B as`${ToCamelCase<K>}Block`]: Handler }
	& (E extends undefined
		? {}
		: E extends ReadonlyArray<infer U>
			? { [K in U as `${ToCamelCase<K>}Element`]: Handler }
			: never
	)

type BEM = <B extends string, E extends Array<string> | ReadonlyArray<string>>(block: B, elements?: E) =>
	ValidateElements<E> extends { error: string }
		? ValidateElements<E>
		: ProcessArgs<B, E>

const applyModifiers = (className: string, modifiers: Modifiers) => {
	const classes = [className];

	Object.keys(modifiers).forEach((key) => {
		modifiers[key] && classes.push(`${className}--${key}`);
	});

	return classes.join(' ');
};

const getClassName = (
	className: string,
	modifiers: Maybe<Modifiers>,
	extraClasses: unknown[]
) => {
	const bemClass = modifiers
		? applyModifiers(className, modifiers)
		: className;
	const validExtraClasses = extraClasses.filter((c) => c);
	return validExtraClasses.length
		? `${bemClass} ${validExtraClasses.join(' ')}`
		: bemClass;
};

const getHandler = (name: string): Handler => (modifiers, ...extraClasses) => {
	return getClassName(name, modifiers, extraClasses);
}

const toCamelCase = (s: string) => s.replace(/-./, (match) => match[1].toUpperCase());

export const bem: BEM = (block, elements) => ({
	[`${toCamelCase(block)}Block`]: getHandler(block),
	...((elements || []) as string[]).reduce((result, element) => {
		result[`${toCamelCase(element)}Element`] = getHandler(`${block}__${element}`);
		return result;
	}, {} as Record<string, Handler>)
}) as any
