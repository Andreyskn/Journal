export {};

declare global {
	namespace App {
		type FileType = Plugin.Type;
		type FileExtension = Plugin.Extension;
		type FileData = Plugin.Data | StubFileData;

		type StubFileData = { id: string };
	}

	namespace Plugin {
		interface Registry {}

		type SetPlugin<
			T extends string,
			E extends string,
			A extends Actions.AnyAction,
			D extends App.StubFileData
		> = {
			type: T;
			extension: E;
			action: A;
			data: D;
		};

		type Type = Registry[keyof Registry]['type'];
		type Extension = Registry[keyof Registry]['extension'];
		type Action = Registry[keyof Registry]['action'];
		type Data = Registry[keyof Registry]['data'];

		type InitStateDispatcher = Actions.Dispatcher<[data: App.StubFileData]>;

		type InitStateHandler<T extends Data> = App.Handler<
			{ data: App.StubFileData },
			T
		>;

		type ComponentProps<
			T extends Data,
			D extends Actions.DispatcherMap<any>
		> = { data: T; dispatch: D };
	}
}
