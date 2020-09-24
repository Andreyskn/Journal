export {};

declare global {
	namespace App {
		interface PluginRegistry {}

		type Plugin<
			T extends string,
			E extends string,
			A extends Actions.AnyAction,
			D extends StubFileData
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
			| StubFileData;

		type StubFileData = { id: string };

		type PluginComponentProps<
			T extends FileData,
			D extends Actions.DispatcherMap<any>
		> = { dispatch: D } & (
			| {
					isStubData: true;
					data: StubFileData;
			  }
			| { isStubData: false; data: T }
		);
	}

	namespace Actions {
		type PluginAction = App.PluginRegistry[keyof App.PluginRegistry]['actions'];
	}
}
