import fs from 'fs';

export const createPatternReplacer = (object: Record<string, any>) => {
	const regexp = new RegExp(
		`${Object.keys(object)
			.map((key) => `(?<${key}>\\/\\** *${key} *\\**\\/)`)
			.join('|')}`,
		'gm'
	);

	const getTemplateFromString = (string: string) => {
		return string.replace(regexp, (...args) => {
			const [groups] = args.slice(-1);

			for (let [key, value] of Object.entries(groups)) {
				if (value) {
					return object[key as keyof typeof object];
				}
			}
			return args[0];
		});
	};

	const getTemplateFromFile = (path: string) => {
		return getTemplateFromString(fs.readFileSync(path, 'utf8'));
	};

	return { getTemplateFromFile, getTemplateFromString };
};
