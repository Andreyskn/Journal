import Immutable from 'immutable';

export const createTab = Immutable.Record<Store.TaggedRecords['Tab']>({
	__tag: 'tab',
	id: '',
	name: '',
	path: '',
	type: '' as any,
});
