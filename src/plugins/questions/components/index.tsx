import React from 'react';
import { Questionary } from './Questionary';

export const render: Plugin.Render<Questions.State, Questions.Dispatch> = (
	state,
	dispatch
) => {
	return {
		main: <Questionary state={state} dispatch={dispatch} />,
	};
};
