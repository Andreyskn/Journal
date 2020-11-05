import React, { useMemo } from 'react';

import { Button } from '@blueprintjs/core';
import { useSelector } from '../../../core';
import { DIRECTORY_ID } from '../../../core/fileSystem';

const RecycleBin: React.FC = () => {
	const { trash, files } = useSelector((state) => ({
		trash: (state.files.get(DIRECTORY_ID.trash) as App.Directory).data,
		files: state.files,
	}));

	const deletedFiles = useMemo(() => {
		return Array.from(trash.values())
			.map(
				(symlinkId) =>
					files.get((files.get(symlinkId) as App.Symlink).data)!
			)
			.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt);
	}, [trash]);

	console.log(deletedFiles);

	return (
		<div>
			{deletedFiles.map(({ id, name, type }) => (
				<Button
					key={id}
					text={name}
					icon={type === 'directory' ? 'folder-close' : 'document'}
				/>
			))}
		</div>
	);
};

const pluralize = (singular: string, count: number) =>
	count === 1 ? singular : `${singular}s`;

const TrashCounter: React.FC = () => {
	const { trash } = useSelector((state) => ({
		trash: (state.files.get(DIRECTORY_ID.trash) as App.Directory).data,
	}));

	if (!trash.size) return null;

	return (
		<div>
			{trash.size} {pluralize('item', trash.size)}
		</div>
	);
};

const windowModule: App.WindowModule = {
	id: 'recycle',
	icon: 'trash',
	title: 'Recycle Bin',
	Content: RecycleBin,
	menuEntry: {
		order: 1,
		Label: TrashCounter,
	},
};

export const { id, icon, title, Content, menuEntry } = windowModule;
