import { prompt } from 'enquirer';
import path from 'path';
import fs from 'fs';
import { paramCase, camelCase, pascalCase } from 'change-case';
import { createPatternReplacer } from '../replacer';
import * as iconNames from '@blueprintjs/icons/lib/cjs/generated/iconNames';

const PATHS = {
	pluginsFolder: path.join(__dirname, '../../src/plugins'),
	connector: path.join(__dirname, '../../src/plugins/connector.tsx'),
	registry: path.join(__dirname, '../../src/plugins/registry.ts'),
	identifier: path.join(__dirname, '../../src/utils/identifier.ts'),
	backupFolder: path.join(__dirname, 'backup'),
	connectorBackup: path.join(__dirname, 'backup/connector.tsx'),
	registryBackup: path.join(__dirname, 'backup/registry.ts'),
	identifierBackup: path.join(__dirname, 'backup/identifier.ts'),
};

export const createPluginTemplate = async () => {
	const { label } = await prompt<{ label: string }>({
		type: 'input',
		name: 'label',
		message: 'Label',
		validate: (value) =>
			/^[A-Z]/.test(value) || 'Label should start with a capital letter',
	});

	const { type } = await prompt<{ type: string }>({
		type: 'input',
		name: 'type',
		message: 'Type name',
		validate: (value) =>
			/^[a-z]+(?:-[a-z]+)?$/.test(value) ||
			'Lower case letters with optional dash separator',
	});

	const { extension } = await prompt<{ extension: string }>({
		type: 'input',
		name: 'extension',
		message: 'Extension',
		validate: (value) =>
			/^\.[a-z]+$/.test(value) ||
			'Starts with a dot, contains only lower case letters',
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
		connectedPlugin: `${type}: React.lazy(() => import('./${type}').then(connectPlugin as any)),
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

	fs.mkdirSync(PATHS.backupFolder);
	fs.renameSync(PATHS.connector, PATHS.connectorBackup);
	fs.renameSync(PATHS.registry, PATHS.registryBackup);
	fs.renameSync(PATHS.identifier, PATHS.identifierBackup);

	const { getTemplate } = createPatternReplacer(plugin);

	fs.mkdirSync(plugin.dir);
	fs.mkdirSync(plugin.componentsDir);

	fs.writeFileSync(PATHS.connector, getTemplate(PATHS.connectorBackup));
	fs.writeFileSync(PATHS.registry, getTemplate(PATHS.registryBackup));
	fs.writeFileSync(PATHS.identifier, getTemplate(PATHS.identifierBackup));

	fs.writeFileSync(
		path.join(plugin.dir, 'dispatcher.ts'),
		getTemplate(path.join(__dirname, 'templates/dispatcher.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, 'handlers.ts'),
		getTemplate(path.join(__dirname, 'templates/handlers.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, 'index.ts'),
		getTemplate(path.join(__dirname, 'templates/index.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.dir, `${plugin.varName}.d.ts`),
		getTemplate(path.join(__dirname, 'templates/types.txt'))
	);

	fs.writeFileSync(
		path.join(plugin.componentsDir, `${plugin.componentName}.tsx`),
		getTemplate(path.join(__dirname, 'templates/react.txt'))
	);
	fs.writeFileSync(
		path.join(plugin.componentsDir, plugin.stylesFileName),
		getTemplate(path.join(__dirname, 'templates/styles.txt'))
	);

	const { confirm } = await prompt<{ confirm: boolean }>({
		type: 'confirm',
		name: 'confirm',
		message: 'Files created. Is everything correct?',
	});

	if (!confirm) {
		fs.renameSync(PATHS.connectorBackup, PATHS.connector);
		fs.renameSync(PATHS.registryBackup, PATHS.registry);
		fs.renameSync(PATHS.identifierBackup, PATHS.identifier);
		fs.rmdirSync(plugin.dir, { recursive: true });
	}

	fs.rmdirSync(PATHS.backupFolder, { recursive: true });

	return confirm ? { ok: true } : { error: 'Files restored' };
};
