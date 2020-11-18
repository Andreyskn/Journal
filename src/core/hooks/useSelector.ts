import { useState, useEffect } from 'react';

type UseSelector = <T extends any>(select: (state: Store.State) => T) => T;

export let useSelector: UseSelector;

const init: Store.HookInitializer = (store) => {
	useSelector = (select) => {
		const [data, setData] = useState(() => select(store.getState()));

		useEffect(
			() =>
				store.subscribe(() => {
					setData(select(store.getState()));
				}),
			[]
		);

		return data;
	};
};

export default init;
