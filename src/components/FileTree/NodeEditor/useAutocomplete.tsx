import React, {
	useState,
	useImperativeHandle,
	useRef,
	useLayoutEffect,
} from 'react';

import { Menu, MenuItem, IPopoverProps } from '@blueprintjs/core';
import { ValidationResult } from './useValidation';
import { bem } from '../../../utils';
import { NodeEditorProps } from './NodeEditor';
import { EXTENSIONS, PLUGINS_MAP, TYPE_BY_EXTENSION } from '../../../plugins';

const classes = bem('autocomplete-popover', ['item'] as const);

export const useAutocomplete = (
	onSelectProp: (value: string) => void,
	inputValue: string,
	{ type, mode }: NodeEditorProps
) => {
	const autocompleteRef = useRef<AutocompleteRef | null>(null);
	const [isVisible, setVisibility] = useState(false);
	const [extensions, setExtensions] = useState([...EXTENSIONS]);

	const onSelect = (ext?: App.FileExtension) => {
		const value = ext || autocompleteRef.current?.value;
		if (value) {
			onSelectProp(inputValue.endsWith('.') ? value.slice(1) : value);
		}
		setVisibility(false);
	};

	const setState = (validationResult: ValidationResult) => {
		if (
			mode !== 'create' ||
			type === 'folder' ||
			!validationResult.isValid ||
			!validationResult.name ||
			validationResult.extension
		) {
			setVisibility(false);
			return;
		}

		const { blockedExtensions } = validationResult;
		const extensions = EXTENSIONS.filter(
			(ext) => !blockedExtensions.includes(ext)
		);

		setExtensions(extensions);
		setVisibility(extensions.length > 0);
	};

	const content: IPopoverProps['content'] = isVisible ? (
		<Autocomplete
			ref={autocompleteRef}
			items={extensions}
			onSelect={onSelect}
		/>
	) : undefined;

	const onMoveFocus = (direction: 'next' | 'prev') => (
		e?: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (!autocompleteRef.current) return;
		e?.preventDefault();
		direction === 'next'
			? autocompleteRef.current.focusNext()
			: autocompleteRef.current.focusPrev();
	};

	return {
		setState,
		content,
		next: onMoveFocus('next'),
		prev: onMoveFocus('prev'),
		selectCurrent: onSelect,
	};
};

type AutocompleteProps = {
	items: App.FileExtension[];
	onSelect: (value: App.FileExtension) => void;
};

type AutocompleteRef = {
	value: App.FileExtension;
	focusNext: () => void;
	focusPrev: () => void;
};

export const Autocomplete = React.forwardRef<
	AutocompleteRef,
	AutocompleteProps
>(({ items, onSelect }, ref) => {
	const [focus, setFocus] = useState(0);

	useLayoutEffect(() => {
		if (focus >= items.length) {
			setFocus(0);
		}
	}, [items]);

	useImperativeHandle(ref, () => ({
		get value() {
			return items[focus];
		},
		focusNext: () => setFocus((focus + 1) % items.length),
		focusPrev: () => setFocus((focus + items.length - 1) % items.length),
	}));

	return (
		<Menu className={classes.autocompletePopoverBlock()}>
			{items.map((item, index) => (
				<MenuItem
					key={item}
					text={
						<div className={classes.itemElement()}>
							{item}{' '}
							<span>
								{PLUGINS_MAP[TYPE_BY_EXTENSION[item]].label}
							</span>
						</div>
					}
					onClick={() => onSelect(item)}
					active={index === focus}
				/>
			))}
		</Menu>
	);
});
