import React, { useMemo } from 'react';

import './recycle-bin.scss';

import { Button, ButtonGroup, Card, Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from '../../../core';
import { DIRECTORY_ID, sanitizeFileName, SEP } from '../../../core/fileSystem';
import { bem, pluralize } from '../../../utils';
import { PLUGINS_MAP } from '../../../plugins';

const containerClasses = bem('recycle', ['body', 'footer'] as const);
const itemClasses = bem('recycle-item', ['icon', 'info', 'controls'] as const);

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sept',
	'Oct',
	'Nov',
	'Dec',
];

const padNumber = (n: number) => n.toString().padStart(2, '0');

const getDate = (timestamp: Timestamp) => {
	const d = new Date(timestamp);
	return `${padNumber(d.getDate())}-${
		months[d.getMonth()]
	}-${d.getFullYear().toString().slice(-2)} ${padNumber(
		d.getHours()
	)}:${padNumber(d.getMinutes())}`;
};

type TrashItem = {
	symlinkId: App.Symlink['id'];
	targetId: App.File['id'];
} & Pick<App.File, 'name' | 'type' | 'path' | 'lastModifiedAt'>;

const RecycleBin: React.FC = () => {
	const { trash, files } = useSelector((state) => ({
		trash: (state.files.get(DIRECTORY_ID.trash) as App.Directory).data,
		files: state.files,
	}));
	const { dispatch } = useDispatch();

	const trashArray = useMemo(() => {
		return Array.from(trash.values())
			.map(
				(symlinkId): TrashItem => {
					const { id, name, type, path, lastModifiedAt } = files.get(
						(files.get(symlinkId) as App.Symlink).data
					)!;

					return {
						symlinkId,
						targetId: id,
						name: sanitizeFileName(name),
						path: sanitizeFileName(path),
						type,
						lastModifiedAt,
					};
				}
			)
			.sort((a, b) => b.lastModifiedAt - a.lastModifiedAt);
	}, [trash]);

	const onDelete = (
		symlinkId: App.Symlink['id'],
		targetId: App.File['id']
	) => () => {
		dispatch.fs.deleteMultipleFiles({ ids: [symlinkId, targetId] });
	};

	const onRestore = (
		symlinkId: App.Symlink['id'],
		targetId: App.File['id']
	) => () => {
		// TODO: single dispatch
		dispatch.fs.deleteFile({ id: symlinkId });
		dispatch.fs.restoreFile({ id: targetId });
	};

	const onClear = () => {
		dispatch.fs.deleteMultipleFiles({
			ids: trashArray.flatMap(({ symlinkId, targetId }) => [
				symlinkId,
				targetId,
			]),
		});
	};

	return (
		<div className={containerClasses.recycleBlock()}>
			<div className={containerClasses.bodyElement()}>
				{trashArray.map(
					({
						symlinkId,
						targetId,
						name,
						type,
						path,
						lastModifiedAt,
					}) => (
						<Card
							className={itemClasses.recycleItemBlock()}
							key={targetId}
						>
							<Icon
								className={itemClasses.iconElement()}
								icon={PLUGINS_MAP[type]?.icon || 'folder-close'}
							/>
							<div className={itemClasses.infoElement()}>
								{name}
							</div>
							<div
								className={itemClasses.infoElement({
									secondary: true,
								})}
							>
								<span>path:</span>
								{path.replace(`${SEP}${DIRECTORY_ID.main}`, '')}
							</div>
							<div
								className={itemClasses.infoElement({
									secondary: true,
								})}
							>
								<span>deleted:</span>
								{getDate(lastModifiedAt)}
							</div>
							<ButtonGroup
								className={itemClasses.controlsElement()}
							>
								<Button
									onClick={onRestore(symlinkId, targetId)}
									icon='undo'
									title='Restore'
								/>
								<Button
									intent='danger'
									onClick={onDelete(symlinkId, targetId)}
									icon='delete'
									title='Delete'
								/>
							</ButtonGroup>
						</Card>
					)
				)}
			</div>
			<div className={containerClasses.footerElement()}>
				<Button
					disabled={!trashArray.length}
					onClick={onClear}
					text='Empty'
				/>
			</div>
		</div>
	);
};

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
