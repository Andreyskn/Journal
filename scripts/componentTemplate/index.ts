import path from 'path';
import fs from 'fs';
import { paramCase, camelCase } from 'change-case';
import { prompt } from 'enquirer';
import { createPatternReplacer } from '../replacer';

const PATH_TO_COMPONENTS = path.join(__dirname, '../../src/components');

export const createComponentTemplate = async () => {
	const { name } = await prompt<{ name: string }>({
		type: 'input',
		name: 'name',
		message: 'Component name',
		validate: (value) =>
			/^[A-Z]/.test(value) || 'Name should start with a capital letter',
	});

	const component = {
		name,
		dir: path.join(PATH_TO_COMPONENTS, name),
		stylesFileName: `${paramCase(name)}.scss`,
		cssClassName: paramCase(name),
		varName: camelCase(name),
	};

	if (fs.existsSync(component.dir)) {
		return { error: `Component with name "${name}" already exists` };
	}

	const { getTemplate } = createPatternReplacer(component);

	fs.mkdirSync(component.dir);

	fs.writeFileSync(
		path.join(component.dir, 'index.ts'),
		getTemplate(path.join(__dirname, 'templates/index.txt'))
	);

	fs.writeFileSync(
		path.join(component.dir, component.stylesFileName),
		getTemplate(path.join(__dirname, 'templates/styles.txt'))
	);

	fs.writeFileSync(
		path.join(component.dir, `${component.name}.tsx`),
		getTemplate(path.join(__dirname, 'templates/react.txt'))
	);

	return { ok: true };
};
