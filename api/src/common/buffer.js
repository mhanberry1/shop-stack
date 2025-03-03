export const splitBuffer = (buffer, sequence) => {
	const result = [];
	let start = 0;
	let index;

	while ((index = findBytes(buffer, sequence, start)) !== -1) {
		result.push(buffer.slice(start, index));
		start = index + sequence.length;
	}

	result.push(buffer.slice(start));
	return result;
};

export const findBytes = (data, sequence, start = 0) => {
	for (let i = start; i <= data.length - sequence.length; i++) {
		let match = true;

		for (let j = 0; j < sequence.length; j++) {
			if (data[i + j] !== sequence[j]) {
				match = false;
				break;
			}
		}

		if (match) {
			return i;
		}
	}
	return -1;
};
