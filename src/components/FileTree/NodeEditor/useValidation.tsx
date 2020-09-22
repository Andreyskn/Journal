import React, { useRef, useState } from 'react';
import { EXTENSIONS } from '../../../plugins/registry';

import { useBEM } from '../../../utils';
import { NodeEditorProps } from './NodeEditor';

const [errorBlock] = useBEM('validation-popover');

const ErrorMessage: React.FC = ({ children }) => (
	<div className={errorBlock()}>{children}</div>
);

const errors = {
	noName: (type: 'file' | 'folder') => (
		<ErrorMessage>A {type} name must be provided.</ErrorMessage>
	),
	existingName: (name: string, type: 'file' | 'folder') => (
		<ErrorMessage>
			A {type} <b>"{name}"</b> already exists in this location. Please
			choose a different name.
		</ErrorMessage>
	),
	invalidName: (name: string, type: 'file' | 'folder') => (
		<ErrorMessage>
			The name <b>"{name}"</b> is not valid as a {type} name. Please
			choose a different name.
		</ErrorMessage>
	),
	noExtension: () => (
		<ErrorMessage>A file extension must be provided.</ErrorMessage>
	),
	invalidExtension: (ext: string) => (
		<ErrorMessage>
			The extension <b>"{ext}"</b> is invalid. Please choose one of the
			following:{' '}
			<b>
				<i>{EXTENSIONS.join(' | ')}</i>
			</b>
		</ErrorMessage>
	),
};

const FILENAME_RE = new RegExp(
	`^(?<name>[^\\.]+)(?<validExt>\\${EXTENSIONS.join(
		'$|\\'
	)}$)?(?<invalidExt>\..+$)?`
);

const matchFileName = (value: string) => {
	return FILENAME_RE.exec(value) as FileNameRegexExec | null;
};

type FileNameRegexExec = OmitType<RegExpExecArray, 'groups'> & {
	groups: FileNameData;
};

type FileNameData = {
	name: string;
	validExt?: App.FileExtension;
	invalidExt?: string;
};

type ResultError = { isValid: false };

type ResultOk = {
	isValid: true;
	name: string;
	extension: App.FileExtension | '';
	blockedExtensions: App.FileExtension[];
};

export type ValidationResult = ResultOk | ResultError;

export const useValidation = ({ type, cwd, files }: NodeEditorProps) => {
	const itemData = useRef<FileNameData | undefined>();
	const [error, setError] = useState<JSX.Element | undefined>();

	const result = {
		ok: (
			itemData: FileNameData,
			blockedExtensions: App.FileExtension[] = []
		): ResultOk => ({
			isValid: true,
			name: itemData.name,
			extension: itemData.validExt || '',
			blockedExtensions,
		}),
		error: (): ResultError => ({ isValid: false }),
	};

	const validateDistinction = (
		inputValue: string,
		itemData: FileNameData
	): ValidationResult => {
		const blockedExtensions: App.FileExtension[] = [];
		const lowerCaseValue = inputValue.toLowerCase();

		const isAlreadyExist = (files.get(cwd) as App.Directory).data
			.keySeq()
			.map((name) => name.toLowerCase())
			.find((existingName) => {
				let foundMatch: boolean;

				if (type === 'folder' || itemData.validExt) {
					foundMatch = existingName === lowerCaseValue;
				} else {
					EXTENSIONS.forEach((ext) => {
						if (
							existingName ===
							lowerCaseValue +
								(lowerCaseValue.endsWith('.')
									? ext.slice(1)
									: ext)
						) {
							blockedExtensions.push(ext);
						}
					});

					foundMatch = blockedExtensions.length === EXTENSIONS.length;
				}

				return foundMatch;
			});

		if (isAlreadyExist) {
			setError(errors.existingName(inputValue, type));
			return result.error();
		}

		return result.ok(itemData, blockedExtensions);
	};

	const parseInput = (value: string): FileNameData | undefined => {
		if (!value) return;

		switch (type) {
			case 'file': {
				const match = matchFileName(value);

				if (!match) {
					setError(errors.invalidName(value, type));
					return;
				}

				const { invalidExt } = match.groups;

				if (invalidExt) {
					setError(errors.invalidExtension(invalidExt));
					return;
				}

				return match.groups;
			}
			case 'folder':
				return { name: value };
		}
	};

	const onChange = (value: string) => {
		setError(undefined);

		const parsedValue = parseInput(value);
		itemData.current = parsedValue;

		if (parsedValue) {
			return validateDistinction(value, parsedValue);
		}

		return result.error();
	};

	const onCreate = (): ValidationResult => {
		if (error) return result.error();

		if (!itemData.current?.name) {
			setError(errors.noName(type));
			return result.error();
		}

		if (type === 'file' && !itemData.current.validExt) {
			setError(errors.noExtension());
			return result.error();
		}

		return result.ok(itemData.current);
	};

	return { onChange, onCreate, error };
};
