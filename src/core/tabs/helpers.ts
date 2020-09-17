import Immutable from 'immutable';

export const createTab = Immutable.Record<App.TaggedTab>({
	_tag: 'tab',
	id: '',
	name: '',
	path: '',
	type: '' as any,
});
