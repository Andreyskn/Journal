import React from 'react';
import { Callout } from '@blueprintjs/core';
import { useBEM } from './useBEM';

const [boundaryBlock] = useBEM('error-boundary');

type BoundaryProps = {
	name: string;
};

type BoundaryState = {
	error: Error | null;
};

export class ErrorBoundary extends React.Component<
	BoundaryProps,
	BoundaryState
> {
	state: BoundaryState = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		const {
			props: { name, children },
			state: { error },
		} = this;

		if (error) {
			return (
				<Callout
					title={`${name} failed to render`}
					intent='danger'
					className={boundaryBlock()}
				/>
			);
		}

		return children;
	}
}
