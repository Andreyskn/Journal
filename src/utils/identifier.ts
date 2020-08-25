const generateId = (type: keyof typeof EntityType) => {
	const typeCode = EntityType[type].toString(36).padStart(2, '0');
	const timestamp = Date.now().toString(36);
	return typeCode + timestamp;
};

const getType = (id: string) => {
	return EntityType[parseInt(id.slice(0, 2), 36)] as keyof typeof EntityType;
};

const getCreationTime = (id: string): Timestamp => {
	return parseInt(id.slice(2), 36);
};

enum EntityType {
	'file',
	'task-list',
	'task',
}

export const identifier = {
	generateId,
	getType,
	getCreationTime,
};
