const Console: React.FC = () => {
	return null;
};

const windowModule: Windows.Module<'Console'> = {
	id: 'console',
	icon: 'console',
	title: 'Console',
	Content: Console,
	menuEntry: {
		order: 2,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;

declare global {
	namespace Windows {
		interface Registry {
			Console: SetWindow<'console'>;
		}
	}
}
