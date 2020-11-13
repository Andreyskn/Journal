import { useState } from 'react';
import { Alert as AlertImpl, Classes, IAlertProps } from '@blueprintjs/core';

type AlertData = Pick<
	IAlertProps,
	| 'icon'
	| 'confirmButtonText'
	| 'cancelButtonText'
	| 'intent'
	| 'onConfirm'
	| 'onCancel'
> & { content: React.ReactNode };

type AlertProps = AlertData & { isOpen: boolean };

const defaultProps: AlertProps = { isOpen: false, content: null };

export const useAlert = () => {
	const [{ content, ...props }, setProps] = useState<AlertProps>(
		defaultProps
	);

	const showAlert = (props: AlertData) => {
		setProps({ ...props, isOpen: true });
	};

	const onClose: IAlertProps['onClose'] = () => {
		setProps(defaultProps);
	};

	const Alert: React.FC = () => (
		<AlertImpl {...props} className={Classes.DARK} onClose={onClose}>
			{content}
		</AlertImpl>
	);

	return { Alert, showAlert };
};
