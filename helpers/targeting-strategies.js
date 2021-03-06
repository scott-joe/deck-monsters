const TARGET_HIGHEST_HP_PLAYER = 'TARGET_HIGHEST_HP_PLAYER';
const TARGET_MAX_HP_PLAYER = 'TARGET_MAX_HP_PLAYER';
const TARGET_NEXT_PLAYER = 'TARGET_NEXT_PLAYER';

function getTarget ({ playerContestant, contestants = [], strategy = TARGET_NEXT_PLAYER }) {
	switch (strategy) {
		case TARGET_HIGHEST_HP_PLAYER: {
			const defaultTarget = getTarget({ playerContestant, contestants });

			return contestants.reduce((potentialTarget, contestant) => {
				// Skip the player
				if (contestant === playerContestant) return potentialTarget;

				// If another monster has higher current hp, target them instead
				if (contestant.monster.hp > potentialTarget.monster.hp) {
					return contestant;
				}

				// Otherwise, continue
				return potentialTarget;
			}, defaultTarget);
		}
		case TARGET_MAX_HP_PLAYER: {
			const defaultTarget = getTarget({ playerContestant, contestants });

			return contestants.reduce((potentialTarget, contestant) => {
				// Skip the player
				if (contestant === playerContestant) return potentialTarget;

				// If another monster has higher maxHp, target them instead
				if (contestant.monster.maxHp > potentialTarget.monster.maxHp) {
					return contestant;
				}

				// Otherwise, continue
				return potentialTarget;
			}, defaultTarget);
		}
		case TARGET_NEXT_PLAYER:
		default: {
			const currentIndex = contestants.indexOf(playerContestant);
			let nextIndex = currentIndex + 1;

			if (nextIndex >= contestants.length) nextIndex = 0;

			return contestants[nextIndex];
		}
	}
}

module.exports = {
	TARGET_HIGHEST_HP_PLAYER,
	TARGET_MAX_HP_PLAYER,
	TARGET_NEXT_PLAYER,
	getTarget
};
