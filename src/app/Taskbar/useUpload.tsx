import { useRef } from 'react';
import { DIRECTORY_ID, fs } from '../../core/fileSystem';
import { EXTENSIONS, TYPE_BY_EXTENSION } from '../../plugins';

const FILENAME_RE = new RegExp(
	`^(?<name>[^\\.]+).*?(?<extension>\\${EXTENSIONS.join('|\\')})?\\.md$`
);

type FileNameExec = Maybe<
	OmitType<RegExpExecArray, 'groups'> & {
		groups: {
			name: string;
			extension?: Model.FileExtension;
		};
	}
>;

export const useUpload = (
	appFiles: Store.FileSystemState['files'],
	dispatch: Store.Dispatch
) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const onStartUpload = () => {
		fileInputRef.current!.click();
	};

	const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files) return;

		const uploadDirectory = appFiles.get(
			DIRECTORY_ID.main
		) as Store.Directory;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const match = FILENAME_RE.exec(file.name) as FileNameExec;

			if (!match) continue;

			const { name, extension = '.n' } = match.groups;
			const fullName = name + extension;

			if (uploadDirectory.data.has(fullName)) continue;

			file.text().then((text) => {
				// TODO: batch dispatch to create multiple files
				dispatch.fs.createFile({
					name: fullName,
					type: TYPE_BY_EXTENSION[extension],
					data: fs.createFileData(text),
					parent: uploadDirectory.id,
				});
			});
		}

		e.target.value = '';
	};

	const fileInput = (
		<input
			style={{ display: 'none' }}
			ref={fileInputRef}
			type='file'
			multiple
			accept='.md'
			onChange={onUpload}
		/>
	);

	return { onUpload: onStartUpload, fileInput };
};
