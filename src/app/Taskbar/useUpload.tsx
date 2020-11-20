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

type FileImportData = {
	name: string;
	type: Model.FileType;
	data: Model.FileData;
};

const enum RejectReasons {
	InvalidExtension,
	NameCollision,
}

export const useUpload = (
	appFiles: Store.FileSystemState['files'],
	batch: Store.BatchDispatch
) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const onStartUpload = () => {
		fileInputRef.current!.click();
	};

	const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const files = Array.from(e.target.files);

		const uploadDirectory = appFiles.get(
			DIRECTORY_ID.main
		) as Store.Directory;

		Promise.allSettled(
			files.map((file) => {
				return new Promise<FileImportData>((resolve, reject) => {
					const match = FILENAME_RE.exec(file.name) as FileNameExec;

					if (!match) return reject(RejectReasons.InvalidExtension);

					const { name, extension = '.n' } = match.groups;
					const fullName = name + extension;

					if (uploadDirectory.data.has(fullName))
						return reject(RejectReasons.NameCollision);

					file.text().then((text) => {
						resolve({
							name: fullName,
							data: fs.createFileData(text),
							type: TYPE_BY_EXTENSION[extension],
						});
					});
				});
			})
		).then((results) => {
			batch((dispatch) => {
				results.forEach((result) => {
					if (result.status === 'rejected') return; // TODO: handle rejection

					dispatch.fs.createFile({
						...result.value,
						parent: uploadDirectory.id,
					});
				});
			});
		});

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
