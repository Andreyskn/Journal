import { useMemo } from 'react';

import './recycle-bin.scss';

import { Button, ButtonGroup, Card, Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from '../../../core';
import { DIRECTORY_ID, fs } from '../../../core/fileSystem';
import { bem, pluralize } from '../../../utils';
import { PLUGINS_MAP } from '../../../plugins';
import { useAppContext } from '../../context';

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
	'Sep',
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
	symlinkId: Store.Symlink['id'];
	target: Store.File;
	sanitizedName: Store.File['name'];
	sanitizedPath: Store.File['path'];
};

const RecycleBin: React.FC = () => {
	const { trash, files } = useSelector((state) => ({
		trash: (state.files.get(DIRECTORY_ID.trash) as Store.Directory).data,
		files: state.files,
	}));
	const { batch } = useDispatch();
	const { showAlert } = useAppContext();

	const trashArray = useMemo(() => {
		return Array.from(trash.values())
			.map(
				(symlinkId): TrashItem => {
					const target = files.get(
						(files.get(symlinkId) as Store.Symlink).data
					)!;

					return {
						symlinkId,
						target: target,
						sanitizedName: fs.sanitizeFileName(target.name),
						sanitizedPath: fs.sanitizeFileName(target.path),
					};
				}
			)
			.sort((a, b) => b.target.lastModifiedAt - a.target.lastModifiedAt);
	}, [trash]);

	const onDelete = (
		symlinkId: Store.Symlink['id'],
		targetId: Store.File['id']
	) => () => {
		// TODO: show confirmation dialog
		batch((dispatch) => {
			dispatch.fs.deleteFile({ id: symlinkId });
			dispatch.fs.deleteFile({ id: targetId });
		});
	};

	const onRestore = (
		symlinkId: Store.Symlink['id'],
		target: Store.File,
		sanitizedName: Store.File['name']
	) => () => {
		// TODO: same code is used in FileTree, consider abstracting out
		new Promise<boolean>((resolve) => {
			const targetData = (files.get(target.parent) as Store.Directory)
				.data;
			const hasNameCollision = targetData.has(sanitizedName);

			if (!hasNameCollision) return resolve(true);

			showAlert({
				icon: 'warning-sign',
				confirmButtonText: 'Replace',
				cancelButtonText: 'Cancel',
				intent: 'warning',
				content: (
					<p>
						A {fs.isDirectory(target) ? 'folder' : 'file'} with the
						name <b>{sanitizedName}</b> already exists in the
						destination folder. Do you want to replace it?
					</p>
				),
				onConfirm: () => resolve(true),
				onCancel: () => resolve(false),
			});
		}).then((confirm) => {
			if (!confirm) return;
			batch((dispatch) => {
				dispatch.fs.deleteFile({ id: symlinkId });
				dispatch.fs.restoreFile({ id: target.id });
			});
		});
	};

	const onClear = () => {
		// TODO: show confirmation dialog
		batch((dispatch) => {
			trashArray
				.flatMap(({ symlinkId, target }) => [symlinkId, target.id])
				.forEach((id) => {
					dispatch.fs.deleteFile({ id });
				});
		});
	};

	return (
		<div className={containerClasses.recycleBlock()}>
			<div className={containerClasses.bodyElement()}>
				{trashArray.map(
					({ symlinkId, target, sanitizedName, sanitizedPath }) => (
						<Card
							className={itemClasses.recycleItemBlock()}
							key={symlinkId}
						>
							<Icon
								className={itemClasses.iconElement()}
								icon={
									PLUGINS_MAP[
										target.type as Store.RegularFile['type']
									]?.icon || 'folder-close'
								}
							/>
							<div className={itemClasses.infoElement()}>
								{sanitizedName}
							</div>
							<div
								className={itemClasses.infoElement({
									secondary: true,
								})}
							>
								<span>path:</span>
								{fs.getMainRelativePath(sanitizedPath)}
							</div>
							<div
								className={itemClasses.infoElement({
									secondary: true,
								})}
							>
								<span>deleted:</span>
								{getDate(target.lastModifiedAt)}
							</div>
							<ButtonGroup
								className={itemClasses.controlsElement()}
							>
								<Button
									onClick={onRestore(
										symlinkId,
										target,
										sanitizedName
									)}
									icon='undo'
									title='Restore'
								/>
								<Button
									intent='danger'
									onClick={onDelete(symlinkId, target.id)}
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
		trash: (state.files.get(DIRECTORY_ID.trash) as Store.Directory).data,
	}));

	if (!trash.size) return null;

	return (
		<div>
			{trash.size} {pluralize('item', trash.size)}
		</div>
	);
};

const windowModule: Windows.Module<'RecycleBin'> = {
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

declare global {
	namespace Windows {
		interface Registry {
			RecycleBin: SetWindow<'recycle'>;
		}
	}
}
