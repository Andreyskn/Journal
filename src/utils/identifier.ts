const RANDOM_PART_LENGTH = 4;

export const generateId = () => {
	const randomPart = Math.random()
		.toString(36)
		.slice(2, 2 + RANDOM_PART_LENGTH);
	const timestamp = Date.now().toString(36);

	return randomPart + timestamp;
};
