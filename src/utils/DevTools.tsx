import { clear } from 'idb-keyval';
import { Button } from '@blueprintjs/core';

const style: React.CSSProperties = {
	padding: 15,
};

const DevTools: React.FC = () => {
	const onClear = () => {
		clear().then(() => document.location.reload());
	};

	return (
		<div style={style}>
			<Button text='Clear state' icon='refresh' onClick={onClear} fill />
		</div>
	);
};

const windowModule: Windows.Module<'Dev'> = {
	id: 'dev',
	icon: 'code',
	title: 'Dev Tools',
	Content: DevTools,
	menuEntry: {
		order: Infinity,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;

declare global {
	namespace Windows {
		interface Registry {
			Dev: SetWindow<'dev'>;
		}
	}
}
