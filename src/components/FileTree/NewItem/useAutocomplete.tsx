import React, {
	useState,
	useImperativeHandle,
	useRef,
	useLayoutEffect,
} from 'react';

import { Menu, MenuItem, IPopoverProps } from '@blueprintjs/core';
import { ValidationResult } from './useValidation';
import { fileExtensions, useBEM } from '../../../utils';

const [autocompleteBlock] = useBEM('autocomplete-popover');

export const useAutocomplete = (
	onSelectProp: (value: string) => void,
	inputValue: string
) => {
	const autocompleteRef = useRef<AutocompleteRef | null>(null);
	const [isVisible, setVisibility] = useState(false);
	const [extensions, setExtensions] = useState([...fileExtensions]);

	const onSelect = (ext?: Store.FileExtension) => {
		const value = ext || autocompleteRef.current?.value;
		if (value) {
			onSelectProp(inputValue.endsWith('.') ? value.slice(1) : value);
		}
		setVisibility(false);
	};

	const setState = (validationResult: ValidationResult) => {
		if (
			!validationResult.isValid ||
			!validationResult.name ||
			validationResult.extension
		) {
			setVisibility(false);
			return;
		}

		const { blockedExtensions } = validationResult;
		const extensions = fileExtensions.filter(
			ext => !blockedExtensions.includes(ext)
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
	) : (
		undefined
	);

	return {
		setState,
		content,
		next: () => autocompleteRef.current?.focusNext(),
		prev: () => autocompleteRef.current?.focusPrev(),
		selectCurrent: onSelect,
	};
};

type AutocompleteProps = {
	items: Store.FileExtension[];
	onSelect: (value: Store.FileExtension) => void;
};

type AutocompleteRef = {
	value: Store.FileExtension;
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
		<Menu className={autocompleteBlock()}>
			{items.map((item, index) => (
				<MenuItem
					key={item}
					text={item}
					onClick={() => onSelect(item)}
					active={index === focus}
				/>
			))}
		</Menu>
	);
});
