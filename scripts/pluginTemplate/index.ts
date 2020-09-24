import { prompt } from 'enquirer';
import path from 'path';
import fs from 'fs';
import { paramCase, camelCase, pascalCase } from 'change-case';
import { createPatternReplacer } from '../replacer';
import * as iconNames from '@blueprintjs/icons/lib/cjs/generated/iconNames';
import { PLUGINS } from '../../src/plugins/registry';

const PATHS = {
	pluginsFolder: path.join(__dirname, '../../src/plugins'),
	connector: path.join(__dirname, '../../src/plugins/connector.tsx'),
	registry: path.join(__dirname, '../../src/plugins/registry.ts'),
	identifier: path.join(__dirname, '../../src/utils/identifier.ts'),
};

export const createPluginTemplate = async () => {
	const { label } = await prompt<{ label: string }>({
		type: 'input',
		name: 'label',
		message: 'Label',
		validate: (value) => {
			if (!/^[A-Z]/.test(value)) {
				return 'Label should start with a capital letter';
			}
			if (PLUGINS.find((p) => p.label === value)) {
				return 'Plugin with this label already exists';
			}
			return true;
		},
	});

	const { type } = await prompt<{ type: string }>({
		type: 'input',
		name: 'type',
		message: 'Type name',
		validate: (value) => {
			if (!/^[a-z]+(?:-[a-z]+)?$/.test(value)) {
				return 'Lower case letters with optional dash separator';
			}
			if (PLUGINS.find((p) => p.type === value)) {
				return 'Plugin with this type already exists';
			}
			return true;
		},
	});

	const { extension } = await prompt<{ extension: string }>({
		type: 'input',
		name: 'extension',
		message: 'Extension',
		validate: (value) => {
			if (!/^\.[a-z]+$/.test(value)) {
				return 'Starts with a dot, contains only lower case letters';
			}
			if (PLUGINS.find((p) => p.extension === value)) {
				return 'Plugin with this extension already exists';
			}
			return true;
		},
	});

	const { icon } = await prompt<{ icon: string }>({
		type: 'autocomplete',
		name: 'icon',
		message: 'Icon',
		choices: Object.values(iconNames),
	});

	const interfaceName = pascalCase(type);
	const varName = camelCase(type);
	const cssClassName = paramCase(type);

	const plugin = {
		pluginInfo: `{
		type: '${type}',
		extension: '${extension}',
		icon: '${icon}',
		label: '${label}',
	},
	/* pluginInfo */`,
		connectedPlugin: `'${type}': React.lazy(() => import('./${type}').then(connectPlugin as any)),
	/* connectedPlugin */`,
		entityType: `'${type}',
	/* entityType */`,
		type,
		extension,
		label,
		interfaceName,
		componentName: `${interfaceName}Plugin`,
		cssClassName,
		varName,
		dir: path.join(PATHS.pluginsFolder, varName),
		componentsDir: path.join(PATHS.pluginsFolder, varName, 'components'),
		stylesFileName: `${cssClassName}.scss`,
	};

	if (fs.existsSync(plugin.dir)) {
		return { error: `Directory for ${label} plugin already exists` };
	}

	const connectorBackup = fs.readFileSync(PATHS.connector, 'utf8');
	const registryBackup = fs.readFileSync(PATHS.registry, 'utf8');
	const identifierBackup = fs.readFileSync(PATHS.identifier, 'utf8');

	const {
		getTemplateFromFile,
		getTemplateFromString,
	} = createPatternReplacer(plugin);

	fs.mkdirSync(plugin.dir);
	fs.mkdirSync(plugin.componentsDir);

	fs.writeFileSync(PATHS.connector, getTemplateFromString(connectorBackup));
	fs.writeFileSync(PATHS.registry, getTemplateFromString(registryBackup));
	fs.writeFileSync(PATHS.identifier, getTemplateFromString(identifierBackup));

	fs.writeFileSync(
		path.join(plugin.dir, 'dispatcher.ts'),
		getTemplateFromFile(path.join(__dirname, 'templates/dispatcher.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, 'handlers.ts'),
		getTemplateFromFile(path.join(__dirname, 'templates/handlers.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, 'index.ts'),
		getTemplateFromFile(path.join(__dirname, 'templates/index.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, `${plugin.varName}.d.ts`),
		getTemplateFromFile(path.join(__dirname, 'templates/types.txt'))
	);

	fs.writeFileSync(
		path.join(plugin.componentsDir, `${plugin.componentName}.tsx`),
		getTemplateFromFile(path.join(__dirname, 'templates/react.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.componentsDir, plugin.stylesFileName),
		getTemplateFromFile(path.join(__dirname, 'templates/styles.txt'))
	);

	const { confirm } = await prompt<{ confirm: boolean }>({
		type: 'confirm',
		name: 'confirm',
		message: 'Files created. Is everything correct?',
	});

	if (!confirm) {
		fs.writeFileSync(PATHS.connector, connectorBackup);
		fs.writeFileSync(PATHS.registry, registryBackup);
		fs.writeFileSync(PATHS.identifier, identifierBackup);
		fs.rmdirSync(plugin.dir, { recursive: true });
	}

	return confirm ? { ok: true } : { error: 'Files restored' };
};
