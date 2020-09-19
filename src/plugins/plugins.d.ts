import React from 'react';

declare global {
	namespace App {
		interface PluginRegistry {}

		type Plugin<
			T extends string,
			E extends string,
			A extends Actions.AnyAction,
			D extends AnyFileData
		> = {
			type: T;
			extension: E;
			actions: A;
			data: D;
		};

		type FileType = PluginRegistry[keyof PluginRegistry]['type'];
		type FileExtension = PluginRegistry[keyof PluginRegistry]['extension'];
		type FileData =
			| PluginRegistry[keyof PluginRegistry]['data']
			| AnyFileData;

		type AnyFileData = { id: string } & AnyObject;

		type InitFileData = (initialState: AnyFileData) => AnyFileData;

		type PluginComponentProps<
			T extends AnyObject,
			D extends Actions.DispatcherMap<any>
		> = {
			data: T;
			dispatch: D;
		};

		type PluginComponent = React.ComponentType<{
			data: AnyFileData;
			dispatch: Actions.DispatcherMap<any>;
		}>;

		type ConnectedPluginComponent = React.FC<{
			data: FileData;
		}>;

		type PluginHandlers = App.ActionHandlers<
			App.FileData,
			Actions.PluginAction
		>;
	}

	namespace Actions {
		type PluginAction = App.PluginRegistry[keyof App.PluginRegistry]['actions'];
	}
}
