import { useEffect, useRef, useState } from 'react';

import './node-editor.scss';

import { bem } from '../../../utils';
import { Classes, EditableText, Popover, Position } from '@blueprintjs/core';
import { useValidation } from './useValidation';
import { useAutocomplete } from './useAutocomplete';
import { TYPE_BY_EXTENSION } from '../../../plugins';

type CreateMode = { mode: 'create' };
type RenameMode = { mode: 'rename'; name: string };
type NodeEditorMode = CreateMode | RenameMode;

export type NodeEditorProps = Pick<Store.FileSystemState, 'files'> &
	NodeEditorMode & {
		type: 'file' | 'folder';
		cwd: Store.Directory['id'];
		onConfirm: (name: string, type: Store.File['type']) => void;
		onDismiss: () => void;
	};

const classes = bem('node-editor', [
	'content',
	'input',
	'renamer',
	'extension',
	'popover',
] as const);

// TODO: use validation and autocomplete as effects on changing the input value

export const NodeEditor: React.FC<NodeEditorProps> = (props) => {
	const { type, onDismiss, onConfirm } = props;

	const editor = useRef<HTMLDivElement>(null);
	const popover = useRef<Popover>(null);
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
		onConfirm(
			name + extension,
			extension ? TYPE_BY_EXTENSION[extension] : 'directory'
		);
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
						className={classes.contentElement()}
					>
						<input
							value={inputValue}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={onKeyDown}
							className={classes.inputElement(
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
					<div className={classes.contentElement()}>
						<EditableText
							isEditing
							className={classes.renamerElement()}
							defaultValue={name}
							selectAllOnFocus
							minWidth={0}
							placeholder=''
							onChange={(v) => onChange(v + extension)}
							onCancel={onDismiss}
							onConfirm={() => {
								tryConfirm();
								onDismiss();
							}}
						/>
						{extension && (
							<span className={classes.extensionElement()}>
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
			className={classes.nodeEditorBlock()}
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
				popoverClassName={classes.popoverElement()}
			>
				{renderEditor()}
			</Popover>
		</div>
	);
};
