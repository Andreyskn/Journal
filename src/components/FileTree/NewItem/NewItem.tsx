import React, { useEffect, useRef, useState } from 'react';

import './new-item.scss';

import { useBEM, getFolderPath, extensions } from '../../../utils';
import { FileTreeDispatch } from '../dispatcher';
import { Classes, Popover, Position } from '@blueprintjs/core';

export type NewItemProps = Pick<Store.FileSystemState, 'folders'> & {
	type: 'file' | 'folder';
	cwd: Store.Folder['path'];
	onCreate: (name: string) => void;
	onDismiss: () => void;
	dispatch: FileTreeDispatch;
};

const [newItemBlock, newItemElement] = useBEM('new-item');

const ErrorMessage: React.FC = ({ children }) => (
	<div className={newItemElement('error')}>{children}</div>
);

const errors = {
	noName: (type: 'file' | 'folder') => (
		<ErrorMessage>A {type} name must be provided.</ErrorMessage>
	),
	existingName: (name: string, type: 'file' | 'folder') => (
		<ErrorMessage>
			A {type} <b>{name}</b> already exists in this location. Please
			choose a different name.
		</ErrorMessage>
	),
	invalidName: (name: string) => (
		<ErrorMessage>
			The name <b>{name}</b> is not valid as a file name. Please choose a
			different name.
		</ErrorMessage>
	),
};

const fileNameRegex = new RegExp(
	`^(?<name>[^\\.]+)(?:\\.|(?<ext>\\${Object.values(extensions).join(
		'|\\'
	)}))?$`
);

type FileNameRegexExec = OmitType<RegExpExecArray, 'groups'> & {
	groups: {
		name: string;
		ext: Store.FileExtension;
	};
};

export const NewItem: React.FC<NewItemProps> = ({
	type,
	cwd,
	folders,
	dispatch,
	onDismiss,
	onCreate,
}) => {
	const form = useRef<HTMLFormElement | null>(null);
	const input = useRef<HTMLInputElement | null>(null);
	const [error, setError] = useState<JSX.Element | undefined>();

	const createItem = (name?: string) => {
		if (!name || error) return;

		switch (type) {
			case 'file':
				dispatch.createFile(name, cwd);
				break;
			case 'folder':
				dispatch.createFolder(name, cwd);
				break;
		}

		onCreate(name);
	};

	const validateInput = (value: string) => {
		switch (type) {
			case 'file': {
				if (!value) {
					return setError(errors.noName(type));
				}

				const matchPattern = fileNameRegex.exec(
					value
				) as FileNameRegexExec | null;

				if (!matchPattern) {
					return setError(errors.invalidName(value));
				}

				const {
					groups: { name, ext = '.t' },
				} = matchPattern;

				const isAlreadyExists = folders
					.get(cwd)!
					.content.files.find(
						existingName =>
							existingName.toLowerCase() ===
							`${cwd}${name}${ext}`.toLowerCase()
					);

				if (isAlreadyExists) {
					return setError(errors.existingName(value, type));
				}
				break;
			}
			case 'folder': {
				if (!value) {
					return setError(errors.noName(type));
				}

				const isAlreadyExists = folders
					.get(cwd)!
					.content.folders.find(
						existingName =>
							existingName.toLowerCase() ===
							getFolderPath(cwd, value).toLowerCase()
					);

				if (isAlreadyExists) {
					return setError(errors.existingName(value, type));
				}
				break;
			}
		}

		setError(undefined);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		validateInput(e.target.value.trim());
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			onDismiss();
		}
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createItem(input.current?.value.trim());
		onDismiss();
	};

	const onClickOutside = ({ target }: MouseEvent) => {
		if (!form.current?.contains(target as Node)) {
			createItem(input.current?.value.trim());
			onDismiss();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, [onClickOutside]);

	return (
		<div className={newItemBlock()} key={type}>
			<Popover
				isOpen={Boolean(error)}
				content={error}
				position={Position.BOTTOM_LEFT}
				autoFocus={false}
				fill
				minimal
			>
				<form
					ref={form}
					onSubmit={onSubmit}
					className={newItemElement('form')}
				>
					<input
						onChange={onChange}
						onKeyDown={onKeyDown}
						ref={input}
						className={newItemElement(
							'input',
							null,
							Classes.INPUT,
							error && Classes.INTENT_DANGER
						)}
						type='text'
						autoFocus
					/>
				</form>
			</Popover>
		</div>
	);
};
