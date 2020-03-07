type Modifiers = Record<string, boolean>;

const applyModifiers = (className: string, modifiers: Modifiers) => {
	const classes = [className];

	Object.keys(modifiers).forEach(key => {
		modifiers[key] && classes.push(`${className}--${key}`);
	});

	return classes.join(' ');
};

const getClassName = (
	className: string,
	modifiers: Maybe<Modifiers>,
	extraClasses: Maybe<string>[]
) => {
	const bemClass = modifiers
		? applyModifiers(className, modifiers)
		: className;
	const validExtraClasses = extraClasses.filter(c => c);
	return validExtraClasses.length
		? `${bemClass} ${validExtraClasses.join(' ')}`
		: bemClass;
};

export const useBEM = (blockName: string) =>
	[
		(modifiers?: Maybe<Modifiers>, ...extraClasses: Maybe<string>[]) =>
			getClassName(blockName, modifiers, extraClasses),
		(
			elementName: string,
			modifiers?: Maybe<Modifiers>,
			...extraClasses: Maybe<string>[]
		) => {
			const elementClass = `${blockName}__${elementName}`;
			return getClassName(elementClass, modifiers, extraClasses);
		},
	] as const;
