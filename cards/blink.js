/* eslint-disable max-len */

const CurseCard = require('./curse');

const { WEEPING_ANGEL } = require('../helpers/creature-types');
const { ATTACK_PHASE, DEFENSE_PHASE } = require('../helpers/phases');
const { roll } = require('../helpers/chance');

class BlinkCard extends CurseCard {
	// Set defaults for these values that can be overridden by the options passed in
	constructor ({
		turnsToBlink,
		energyToStealDice,
		curseAmountDice,
		cursedProp,
		hasChanceToHit,
		icon = '⏳'
	} = {}) {
		super({ cursedProp, hasChanceToHit, icon });

		this.setOptions({
			turnsToBlink,
			energyToStealDice,
			curseAmountDice
		});
	}

	get turnsToBlink () {
		return this.options.turnsToBlink;
	}

	get energyToStealDice () {
		return this.options.energyToStealDice;
	}

	get curseAmountDice () {
		return this.options.curseAmountDice;
	}

	getCurseNarrative (player, target) { // eslint-disable-line class-methods-use-this
		return `${player.givenName} drains xp from ${target.givenName}.`;
	}

	getCurseOverflowNarrative (player, target) { // eslint-disable-line class-methods-use-this
		return `${target.givenName}'s xp penalties have been maxed out.
${player.givenName}'s drain takes from hp instead.`;
	}

	get stats () {
		return `Drain ${this.energyToStealDice} hp and ${this.curseAmountDice} ${this.cursedProp}`;
	}

	effect (blinkPlayer, blinkTarget, ring, activeContestants) { // eslint-disable-line no-unused-vars
		blinkTarget.blinkedTurns = 0;
		const attackRoll = this.getAttackRoll(blinkPlayer);
		const attackSuccess = this.checkSuccess(attackRoll, blinkTarget.int);

		this.emit('rolled', {
			reason: `vs ${blinkTarget.givenName}'s int (${blinkTarget.int}) to time-shift ${blinkTarget.pronouns.him}.`,
			card: this,
			roll: attackRoll,
			player: blinkPlayer,
			target: blinkTarget,
			outcome: `Time shift ${attackSuccess.success ? 'succeeded!' : 'failed.'} ${blinkTarget.givenName} ${attackSuccess.success ? 'blinked!' : 'did not blink. The Doctor would be proud.'}`,
			vs: blinkTarget.int
		});

		if (attackSuccess.success) {
			const blinkEffect = ({
				card,
				phase
			}) => {
				const { effect } = card;

				if (effect && phase === DEFENSE_PHASE) {
					card.effect = (player, target, effectRing, effectActiveContestants) => {
						if (target === blinkTarget) {
							this.emit('effect', {
								effectResult: `not target-able because they are ${this.icon} time-shifted by`,
								player: blinkPlayer,
								target: blinkTarget,
								effectRing
							});

							return !blinkTarget.dead;
						}
						return effect.call(card, player, target, effectRing, effectActiveContestants);
					};
				} else if (phase === ATTACK_PHASE) {
					const turnsLeftToBlink = this.turnsToBlink - blinkTarget.blinkedTurns;
					if (turnsLeftToBlink && !blinkPlayer.dead) {
						blinkTarget.blinkedTurns++;

						const effectResult = `${this.icon} time-shifted for ${turnsLeftToBlink} more turn${turnsLeftToBlink > 1 ? 's' : ''} by`;
						this.emit('effect', {
							effectResult,
							player: blinkPlayer,
							target: blinkTarget,
							ring
						});

						const hpToSteal = roll({ primaryDice: this.energyToStealDice });
						const xpToSteal = roll({ primaryDice: this.curseAmountDice });
						const combinedRoll = {
							primaryDice: `${hpToSteal.primaryDice} (hp) & ${xpToSteal.primaryDice} (xp)`,
							result: `${hpToSteal.result} (hp) & ${xpToSteal.result} (xp)`,
							naturalRoll: {
								result: `${hpToSteal.naturalRoll.result} & ${xpToSteal.naturalRoll.result}`
							},
							bonusResult: 0,
							modifier: 0
						};
						this.curseAmount = -xpToSteal.result;

						this.emit('rolled', {
							reason: `to steal potential energy from ${blinkTarget.identityWithHp}`,
							card: this,
							roll: combinedRoll,
							player: blinkPlayer,
							target: blinkTarget,
							outcome: ''
						});

						// drain hp
						blinkTarget.hit(hpToSteal.result, blinkPlayer, this);
						blinkPlayer.heal(hpToSteal.result, blinkTarget, this);

						// drain xp
						super.effect(blinkPlayer, blinkTarget, ring);
						blinkPlayer.setModifier(this.cursedProp, xpToSteal.result);

						card.play = () => Promise.resolve(true);
					} else {
						blinkTarget.encounterEffects = blinkTarget.encounterEffects.filter(encounterEffect => encounterEffect.effectType !== 'BlinkEffect');

						this.emit('narration', {
							narration: `${blinkTarget.identity} opens ${blinkTarget.pronouns.his} eyes and finds ${blinkTarget.pronouns.him}self in an unfamiliar time.`
						});
					}
				}

				return card;
			};

			blinkEffect.effectType = 'BlinkEffect';
			blinkTarget.encounterEffects = [...blinkTarget.encounterEffects, blinkEffect];

			return true;
		}

		this.emit('miss', {
			attackResult: attackRoll.result,
			attackRoll,
			player: blinkPlayer,
			target: blinkTarget
		});

		return true;
	}
}

BlinkCard.cardType = 'Blink';
BlinkCard.permittedClassesAndTypes = [WEEPING_ANGEL];
BlinkCard.probability = 5;
BlinkCard.description = "Consume your victim's potential energy";
BlinkCard.level = 0;
BlinkCard.cost = 80;
BlinkCard.notForSale = true;

BlinkCard.defaults = {
	...CurseCard.defaults,
	turnsToBlink: 1,
	energyToStealDice: '1d4',
	curseAmountDice: '4d4',
	cursedProp: 'xp',
	hasChanceToHit: false
};


module.exports = BlinkCard;
