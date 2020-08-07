import React, { useEffect, useRef, useState } from 'react';

import './new-item.scss';

import { useBEM } from '../../../utils';
import { FileTreeDispatch } from '../dispatcher';
import { Classes, Popover, Position } from '@blueprintjs/core';
import { useValidation } from './useValidation';
import { useAutocomplete } from './useAutocomplete';

export type NewItemProps = Pick<Store.FileSystemState, 'folders'> & {
	type: 'file' | 'folder';
	cwd: Store.Folder['path'];
	onCreate: (name: string) => void;
	onDismiss: () => void;
	dispatch: FileTreeDispatch;
};

const [newItemBlock, newItemElement] = useBEM('new-item');

export const NewItem: React.FC<NewItemProps> = props => {
	const { type, cwd, dispatch, onDismiss, onCreate } = props;

	const form = useRef<HTMLFormElement | null>(null);
	const input = useRef<HTMLInputElement | null>(null);
	const popover = useRef<Popover | null>(null);
	const [inputValue, setInputValue] = useState('');

	const validation = useValidation(props);
	const autocomplete = useAutocomplete(ext => {
		const value = inputValue + ext;
		setInputValue(value);
		validation.onChange(value);
	}, inputValue);

	const tryCreateItem = () => {
		const validationResult = validation.onCreate();
		if (!validationResult.isValid) return;

		const { name, extension } = validationResult;

		if (type === 'file') {
			dispatch.createFile(name, extension!, cwd);
		} else {
			dispatch.createFolder(name, cwd);
		}

		onCreate(name);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim();
		setInputValue(value);
		const validationResult = validation.onChange(value);

		if (type === 'file') {
			autocomplete.setState(validationResult);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'Escape': {
				onDismiss();
				break;
			}
			case 'ArrowDown': {
				if (autocomplete.content) {
					e.preventDefault();
					autocomplete.next();
				}
				break;
			}
			case 'ArrowUp': {
				if (autocomplete.content) {
					e.preventDefault();
					autocomplete.prev();
				}
				break;
			}
		}
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (autocomplete.content) {
			autocomplete.selectCurrent();
		} else {
			tryCreateItem();
		}
	};

	const onClickOutside = ({ target }: MouseEvent) => {
		if (
			popover.current?.popoverElement.contains(target as Node) ||
			form.current?.contains(target as Node)
		)
			return;
		tryCreateItem();
		onDismiss();
	};

	useEffect(() => {
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, [onClickOutside]);

	return (
		<div className={newItemBlock()} key={type}>
			<Popover
				isOpen={
					Boolean(validation.error) || Boolean(autocomplete.content)
				}
				content={validation.error || autocomplete.content}
				position={Position.BOTTOM_LEFT}
				autoFocus={false}
				fill
				minimal
				ref={popover}
				popoverClassName={newItemElement('popover')}
			>
				<form
					ref={form}
					onSubmit={onSubmit}
					className={newItemElement('form')}
				>
					<input
						value={inputValue}
						onChange={onChange}
						onKeyDown={onKeyDown}
						ref={input}
						className={newItemElement(
							'input',
							null,
							Classes.INPUT,
							validation.error && Classes.INTENT_DANGER
						)}
						type='text'
						autoFocus
					/>
				</form>
			</Popover>
		</div>
	);
};
