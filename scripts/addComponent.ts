import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import program from 'commander';
import { paramCase, camelCase } from 'change-case';
import symbol from 'log-symbols';

const PATH_TO_COMPONENTS = path.join(__dirname, '../src/components');

const component = {
	name: '',
	dir: '',
	stylesFileName: '',
	cssClassName: '',
	varName: '',
};

program.arguments('<name>').action(name => {
	component.name = name;
	component.dir = path.join(PATH_TO_COMPONENTS, name);
	component.stylesFileName = `${paramCase(component.name)}.scss`;
	component.cssClassName = paramCase(component.name);
	component.varName = camelCase(component.name);
});
program.parse(process.argv);

if (!component.name) {
	console.log(symbol.error, chalk.red('Component name was not provided'));
	process.exit();
}

if (fs.existsSync(component.dir)) {
	console.log(
		symbol.error,
		chalk.red(`Component with name "${component.name}" already exists`)
	);
	process.exit();
}

fs.mkdirSync(component.dir);

fs.writeFileSync(
	path.join(component.dir, 'index.ts'),
	`export * from './${component.name}'\n`
);
fs.writeFileSync(
	path.join(component.dir, component.stylesFileName),
	`.${component.cssClassName} {

}
`
);
fs.writeFileSync(
	path.join(component.dir, `${component.name}.tsx`),
	`import React from 'react';
import './${component.stylesFileName}';
import { useBEM } from '../../utils';

export type ${component.name}Props = {

}

const [${component.varName}Block, ${component.varName}Element] = useBEM('${component.cssClassName}');

export const ${component.name}: React.FC<${component.name}Props> = (props) => {
	const {  } = props;

	return (
		<div className={${component.varName}Block()}>

		</div>
	)
}
`
);

console.log(symbol.success, chalk.green(`Created ${component.name} component`));
