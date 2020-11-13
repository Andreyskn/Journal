import { Component } from 'react';
import { Callout } from '@blueprintjs/core';
import { bem } from './bem';

const { errorBoundaryBlock } = bem('error-boundary');

type BoundaryProps = {
	name: string;
};

type BoundaryState = {
	error: Error | null;
};

export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
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
					className={errorBoundaryBlock()}
				/>
			);
		}

		return children;
	}
}
