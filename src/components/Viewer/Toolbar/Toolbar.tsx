import React, { ReactNode } from 'react';

import './toolbar.scss';

import { bem } from '../../../utils';
import {
	Button,
	IMenuItemProps,
	Menu,
	MenuItem,
	Popover,
} from '@blueprintjs/core';

export type ToolbarProps = {
	content?: ReactNode | ReactNode[];
	options: IMenuItemProps[];
};

const classes = bem('toolbar', ['settings'] as const);

export const Toolbar: React.FC<ToolbarProps> = ({ content, options }) => {
	return (
		<div className={classes.toolbarBlock()}>
			{content}
			<Popover
				position='bottom-right'
				minimal
				className={classes.settingsElement()}
			>
				<Button minimal icon='cog' />
				<Menu>
					{options.map((opt, i) => (
						<MenuItem {...opt} key={i} />
					))}
				</Menu>
			</Popover>
		</div>
	);
};
