const TYPE_CODE_LENGTH = 2;
const RANDOM_PART_LENGTH = 4;
const TIMESTAMP_OFFSET = TYPE_CODE_LENGTH + RANDOM_PART_LENGTH;

const generateId = (type: keyof typeof EntityType) => {
	const typeCode = EntityType[type]
		.toString(36)
		.padStart(TYPE_CODE_LENGTH, '0');
	const randomPart = Math.random()
		.toString(36)
		.slice(2, 2 + RANDOM_PART_LENGTH);
	const timestamp = Date.now().toString(36);

	return typeCode + randomPart + timestamp;
};

const getType = (id: string) => {
	return EntityType[
		parseInt(id.slice(0, TYPE_CODE_LENGTH), 36)
	] as keyof typeof EntityType;
};

const getCreationTime = (id: string): Timestamp => {
	return parseInt(id.slice(TIMESTAMP_OFFSET), 36);
};

enum EntityType {
	'file' = 370, // 'AA' in base 36
	'task-list',
	'task',
	'note',
}

export const identifier = {
	generateId,
	getType,
	getCreationTime,
};
