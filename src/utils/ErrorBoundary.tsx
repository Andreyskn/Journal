import React from 'react';
import { Callout } from '@blueprintjs/core';
import { useBEM } from './useBEM';

const [boundaryBlock] = useBEM('error-boundary');

type BoundaryState = {
	error: Error | null;
};

export const withErrorBoundary = <T extends React.ComponentType<any>>(
	Component: T
) => {
	return (class ErrorBoundary extends React.Component {
		state: BoundaryState = { error: null };

		static getDerivedStateFromError(error: Error) {
			return { error };
		}

		render() {
			if (this.state.error) {
				return (
					<Callout
						title={`${(Component as any).name ||
							'Component'} failed to render`}
						intent='danger'
						className={boundaryBlock()}
					/>
				);
			}

			return <Component {...(this.props as any)} />;
		}
	} as unknown) as T;
};
