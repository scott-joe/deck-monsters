const { expect } = require('../shared/test-setup');

const { calculateXP } = require('./experience');

describe('./helpers/experience.js', () => {
	describe.only('calculateXP in 1:1 battles', () => {
		it('assigns 13 XP if you kill a same level monster', () => {
			const constestant1 = {
				monster: {
					level: 1
				}
			};
			const constestant2 = {
				monster: {
					level: 1
				},
				killed: [constestant1.monster]
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(13);
		});

		it('assigns 24 XP if you kill a 1 level higher monster', () => {
			const constestant1 = {
				monster: {
					level: 2
				}
			};
			const constestant2 = {
				monster: {
					level: 1
				},
				killed: [constestant1.monster]
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(24);
		});

		it('assigns 7 XP if you kill a 1 level lower monster', () => {
			const constestant1 = {
				monster: {
					level: 1
				}
			};
			const constestant2 = {
				monster: {
					level: 2
				},
				killed: [constestant1.monster]
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(7);
		});

		it('assigns no XP if you kill a monster that is 5 or more levels lower', () => {
			const constestant1 = {
				monster: {
					level: 0
				}
			};
			const constestant2 = {
				monster: {
					level: 6
				},
				killed: [constestant1.monster]
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(0);
		});

		it('assigns 1 XP if level 1 monster is killed by same level monster', () => {
			const constestant1 = {
				monster: {
					level: 1
				}
			};
			const constestant2 = {
				monster: {
					level: 1
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(1);
		});

		it('assigns 1 XP if level 100 monster is killed by same level monster', () => {
			const constestant1 = {
				monster: {
					level: 100
				}
			};
			const constestant2 = {
				monster: {
					level: 100
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(1);
		});

		it('assigns 1 XP if you are killed by 1 level lower monster', () => {
			const constestant1 = {
				monster: {
					level: 1
				}
			};
			const constestant2 = {
				monster: {
					level: 2
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(1);
		});

		it('assigns no XP if you are killed by 4 level lower monster', () => {
			const constestant1 = {
				monster: {
					level: 1
				}
			};
			const constestant2 = {
				monster: {
					level: 5
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(0);
		});

		it('assigns 2 XP if you are killed by 1 level higher monster', () => {
			const constestant1 = {
				monster: {
					level: 2
				}
			};
			const constestant2 = {
				monster: {
					level: 1
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(2);
		});

		it('assigns 16 XP if you are killed by 4 level higher monster', () => {
			const constestant1 = {
				monster: {
					level: 5
				}
			};
			const constestant2 = {
				monster: {
					level: 1
				},
				killedBy: constestant1.monster
			};

			const contestants = [constestant1, constestant2];

			expect(calculateXP(constestant2, contestants)).to.equal(16);
		});
	});
});
