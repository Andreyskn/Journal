const TYPE_CODE_LENGTH = 1;
const RANDOM_PART_LENGTH = 4;
const TIMESTAMP_OFFSET = TYPE_CODE_LENGTH + RANDOM_PART_LENGTH;

const generateId = (type: keyof typeof EntityType) => {
	const typeCode = String.fromCodePoint(EntityType[type]);
	const randomPart = Math.random()
		.toString(36)
		.slice(2, 2 + RANDOM_PART_LENGTH);
	const timestamp = Date.now().toString(36);

	return typeCode + randomPart + timestamp;
};

const getType = (id: string) => {
	return EntityType[id.codePointAt(0)!] as keyof typeof EntityType;
};

const getCreationTime = (id: string): Timestamp => {
	return parseInt(id.slice(TIMESTAMP_OFFSET), 36);
};

enum EntityType {
	'file' = 11039,
	'task-list',
	'task',
	'note',
	'questions',
	/* entityType */
}

export const identifier = {
	generateId,
	getType,
	getCreationTime,
};
