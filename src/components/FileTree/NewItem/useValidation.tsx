import React, { useRef, useState } from 'react';

import { useBEM, fileExtensions, getFolderPath } from '../../../utils';
import { NewItemProps } from './NewItem';

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
			A {type} <b>{name}</b> already exists in this location. Please
			choose a different name.
		</ErrorMessage>
	),
	invalidName: (name: string, type: 'file' | 'folder') => (
		<ErrorMessage>
			The name <b>{name}</b> is not valid as a {type} name. Please choose
			a different name.
		</ErrorMessage>
	),
	noExtension: () => (
		<ErrorMessage>A file extension must be provided.</ErrorMessage>
	),
	invalidExtension: (ext: string) => (
		<ErrorMessage>
			The extension <b>{ext}</b> is invalid. Please choose one of the
			following:{' '}
			<b>
				<i>{fileExtensions.join(' | ')}</i>
			</b>
		</ErrorMessage>
	),
};

const fileNameRegex = new RegExp(
	`^(?<name>[^\\.]+)(?<validExt>\\${fileExtensions.join(
		'$|\\'
	)}$)?(?<invalidExt>\..+$)?`
);

const matchFileName = (value: string) => {
	return fileNameRegex.exec(value) as FileNameRegexExec | null;
};

type FileNameRegexExec = OmitType<RegExpExecArray, 'groups'> & {
	groups: FileNameData;
};

type FileNameData = {
	name: string;
	validExt?: Store.FileExtension;
	invalidExt?: string;
};

type InvalidResult = { isValid: false };

type ValidResult = {
	isValid: true;
	name: string;
	extension?: Store.FileExtension;
	blockedExtensions: Store.FileExtension[];
};

export type ValidationResult = ValidResult | InvalidResult;

export const useValidation = ({ type, cwd, folders }: NewItemProps) => {
	const itemData = useRef<FileNameData | undefined>();
	const [error, setError] = useState<JSX.Element | undefined>();

	const validateDistinction = (
		inputValue: string,
		itemData: FileNameData
	): ValidationResult => {
		const blockedExtensions: Store.FileExtension[] = [];

		const isAlreadyExist = folders
			.get(cwd)!
			.content[type === 'file' ? 'files' : 'folders'].find(
				existingName => {
					const targetPath = existingName.toLowerCase();
					let foundMatch: boolean;

					if (type === 'file') {
						const newPath = `${cwd}${inputValue}`.toLowerCase();

						if (itemData.validExt) {
							foundMatch = targetPath === newPath;
						} else {
							fileExtensions.forEach(ext => {
								if (
									targetPath ===
									newPath +
										(newPath.endsWith('.')
											? ext.slice(1)
											: ext)
								) {
									blockedExtensions.push(ext);
								}
							});

							foundMatch =
								blockedExtensions.length ===
								fileExtensions.length;
						}
					} else {
						foundMatch =
							targetPath ===
							getFolderPath(cwd, inputValue).toLowerCase();
					}

					return foundMatch;
				}
			);

		if (isAlreadyExist) {
			setError(errors.existingName(inputValue, type));
			return fail();
		}

		return success(itemData, blockedExtensions);
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

	const success = (
		itemData: FileNameData,
		blockedExtensions: Store.FileExtension[] = []
	): ValidResult => ({
		isValid: true,
		name: itemData.name,
		extension: itemData.validExt,
		blockedExtensions,
	});

	const fail = (): InvalidResult => ({ isValid: false });

	const onChange = (value: string) => {
		setError(undefined);

		const parsedValue = parseInput(value);
		itemData.current = parsedValue;

		if (parsedValue) {
			return validateDistinction(value, parsedValue);
		}

		return fail();
	};

	const onCreate = (): ValidationResult => {
		if (error) return fail();

		if (!itemData.current?.name) {
			setError(errors.noName(type));
			return fail();
		}

		if (type === 'file' && !itemData.current.validExt) {
			setError(errors.noExtension());
			return fail();
		}

		return success(itemData.current);
	};

	return { onChange, onCreate, error };
};
