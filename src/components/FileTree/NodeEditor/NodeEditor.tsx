import React, { useEffect, useRef, useState } from 'react';

import './node-editor.scss';

import { useBEM } from '../../../utils';
import { Classes, EditableText, Popover, Position } from '@blueprintjs/core';
import { useValidation } from './useValidation';
import { useAutocomplete } from './useAutocomplete';

type CreateMode = { mode: 'create' };
type RenameMode = { mode: 'rename'; name: string };
type NodeEditorMode = CreateMode | RenameMode;

export type NodeEditorProps = Pick<App.FileSystemState, 'files'> &
	NodeEditorMode & {
		type: 'file' | 'folder';
		cwd: App.Directory['id'];
		onConfirm: (name: string) => void;
		onDismiss: () => void;
	};

const [nodeEditorBlock, nodeEditorElement] = useBEM('node-editor');

// TODO: use validation and autocomplete as effects on changing the input value

export const NodeEditor: React.FC<NodeEditorProps> = (props) => {
	const { type, onDismiss, onConfirm } = props;

	const editor = useRef<HTMLDivElement | null>(null);
	const popover = useRef<Popover | null>(null);
	const [inputValue, setInputValue] = useState('');

	const validation = useValidation(props);
	const autocomplete = useAutocomplete(
		(ext) => {
			const value = inputValue + ext;
			setInputValue(value);
			validation.onChange(value);
			tryConfirm();
		},
		inputValue,
		props
	);

	const tryConfirm = () => {
		const validationResult = validation.onCreate();
		if (!validationResult.isValid) return;

		const { name, extension } = validationResult;
		onConfirm(name + extension);
	};

	const onChange = (value: string) => {
		setInputValue(value);
		const validationResult = validation.onChange(value);
		autocomplete.setState(validationResult);
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'Escape': {
				onDismiss();
				break;
			}
			case 'ArrowDown': {
				autocomplete.next(e);
				break;
			}
			case 'ArrowUp': {
				autocomplete.prev(e);
				break;
			}
		}
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (autocomplete.content) {
			autocomplete.selectCurrent();
		} else {
			tryConfirm();
		}
	};

	const onClickOutside = ({ target }: MouseEvent) => {
		if (
			popover.current?.popoverElement?.contains(target as Node) ||
			editor.current?.contains(target as Node)
		)
			return;
		tryConfirm();
		onDismiss();
	};

	useEffect(() => {
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, [onClickOutside]);

	const renderEditor = () => {
		switch (props.mode) {
			case 'create':
				return (
					<form
						onSubmit={onSubmit}
						className={nodeEditorElement('content')}
					>
						<input
							value={inputValue}
							onChange={(e) => onChange(e.target.value.trim())}
							onKeyDown={onKeyDown}
							className={nodeEditorElement(
								'input',
								null,
								Classes.INPUT,
								validation.error && Classes.INTENT_DANGER
							)}
							type='text'
							autoFocus
						/>
					</form>
				);
			case 'rename': {
				let { name } = props;
				let extension = '';

				if (type === 'file') {
					const dotIndex = name.indexOf('.');
					extension = name.slice(dotIndex);
					name = name.slice(0, dotIndex);
				}

				return (
					<div className={nodeEditorElement('content')}>
						<EditableText
							isEditing
							className={nodeEditorElement('renamer')}
							defaultValue={name}
							selectAllOnFocus
							minWidth={0}
							placeholder=''
							onChange={(v) => onChange(v.trim() + extension)}
							onCancel={onDismiss}
							onConfirm={() => {
								tryConfirm();
								onDismiss();
							}}
						/>
						{extension && (
							<span className={nodeEditorElement('extension')}>
								{extension}
							</span>
						)}
					</div>
				);
			}
		}
	};

	return (
		<div
			className={nodeEditorBlock()}
			key={type}
			ref={editor}
			onClick={(e) => e.stopPropagation()}
		>
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
				popoverClassName={nodeEditorElement('popover')}
			>
				{renderEditor()}
			</Popover>
		</div>
	);
};
