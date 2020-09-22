import { prompt } from 'enquirer';
import chalk from 'chalk';
import symbol from 'log-symbols';

import { createComponentTemplate } from './componentTemplate';
import { createPluginTemplate } from './pluginTemplate';

const logError = (message: string) => {
	message && console.log(symbol.error, chalk.red(message));
};

const templateTypes = ['Component', 'Plugin'] as const;

(async () => {
	const { type } = await prompt<{ type: typeof templateTypes[number] }>({
		type: 'select',
		name: 'type',
		message: 'Create template for:',
		choices: [...templateTypes],
	});

	while (true) {
		let result: { ok?: boolean; error?: string };

		switch (type) {
			case 'Component': {
				result = await createComponentTemplate();
				break;
			}
			case 'Plugin': {
				result = await createPluginTemplate();
				break;
			}
		}

		if (result.error) logError(result.error);
		else process.exit();
	}
})().catch(logError);
