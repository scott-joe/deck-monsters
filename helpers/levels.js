const STARTING_LEVEL = 0;

// levels are a Fibonacci sequence (100, 200, 300, 500, 800, 1300, 2100, ...)
const getLevel = (xp = 0, prevPrevThreshold = 0, prevThreshold = 50, level = STARTING_LEVEL) => {
	const threshold = prevPrevThreshold + prevThreshold;

	if (xp < threshold) {
		return level;
	}

	return getLevel(xp, prevThreshold, threshold, level + 1);
};

module.exports = {
	getLevel
};
