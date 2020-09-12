import React from 'react';
import { withErrorBoundary } from './ErrorBoundary';
import { initDispatchers } from './helpers';

export const wrapPluginComponent = <
	C extends App.RawPluginComponent,
	D extends Record<string, Actions.Dispatcher<any[]>>
>(
	Component: C,
	dispatchers: D
) => {
	const ErrorBoundedPlugin = withErrorBoundary(Component);

	return (class ConnectedPlugin extends React.Component<{
		dispatch: Actions.Dispatch;
	}> {
		_dispatch = initDispatchers(this.props.dispatch, dispatchers);

		render() {
			return (
				<ErrorBoundedPlugin
					{...(this.props as any)}
					dispatch={this._dispatch}
				/>
			);
		}
	} as unknown) as App.PluginComponent;
};
