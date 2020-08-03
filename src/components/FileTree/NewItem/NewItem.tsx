import React, { useEffect, useRef } from 'react';

import './new-item.scss';

import { useBEM } from '../../../utils';
import { FileTreeDispatch } from '../dispatcher';

export type NewItemProps = {
	type: 'file' | 'folder';
	cwd: Store.Folder['path'];
	onCreate: (name: string) => void;
	onDismiss: () => void;
	dispatch: FileTreeDispatch;
};

const [newItemBlock, newItemElement] = useBEM('new-item');

export const NewItem: React.FC<NewItemProps> = ({
	type,
	cwd,
	dispatch,
	onDismiss,
	onCreate,
}) => {
	const form = useRef<HTMLFormElement | null>(null);

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const input = event.currentTarget.elements[0] as HTMLTextAreaElement;

		// TODO: validation

		if (input.value) {
			switch (type) {
				case 'file':
					dispatch.createFile(input.value, cwd);
					break;
				case 'folder':
					dispatch.createFolder(input.value, cwd);
					break;
			}
			onCreate(input.value);
		}

		onDismiss();
	};

	const onClickOutside = ({ target }: MouseEvent) => {
		if (!form.current?.contains(target as Node)) {
			onDismiss();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, [onClickOutside]);

	return (
		<div className={newItemBlock()} key={type}>
			<form
				ref={form}
				onSubmit={onSubmit}
				className={newItemElement('form')}
			>
				<input
					className={newItemElement('input')}
					type='text'
					autoFocus
				/>
			</form>
		</div>
	);
};
