module.exports = {
	name: 'slots',
	help: 'Spin the slots and (optionally) wager some of your coins!',
	aliases: {},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const viewer = tags['username'];

				const icons = {
					1 : (('icon_1' in client.settings.slots && client.settings.slots.icon_1 != '') ? client.settings.slots.icon_1 : 'BrainSlug'),
					2 : (('icon_2' in client.settings.slots && client.settings.slots.icon_2 != '') ? client.settings.slots.icon_2 : 'PogChamp'),
					3 : (('icon_3' in client.settings.slots && client.settings.slots.icon_3 != '') ? client.settings.slots.icon_3 : 'PizzaTime'),
					4 : (('icon_4' in client.settings.slots && client.settings.slots.icon_4 != '') ? client.settings.slots.icon_4 : 'PartyHat'),
					5 : (('icon_5' in client.settings.slots && client.settings.slots.icon_5 != '') ? client.settings.slots.icon_5 : 'RaccAttack'),
				};

				if (args.length < 2) {
					args[1] = 0;
				}

				let risk = parseInt(args[1]);
				if (!isFinite(risk)) {
					risk = 0;
				}

				// If currency enabled...
				if (client.settings.currency.enabled) {
					// Must be a valid number for a wager...
					if (!isNumeric(args[1])) {
						client.say(channel, `@${viewer}, you can only wager whole numbers of ${client.settings.currency.name.plural}.`);
						return;
					}
				}

				// Spin the slots...
				// Weight = gen X amt of nums to increase chance of matching
				const reel = [];
				reel[0] = getWeightedSlot(5);
				reel[1] = getWeightedSlot(5, 2, reel[0]);
				reel[2] = getWeightedSlot(5, 2, reel[0]);

				let num = false;
				let win = true;
				Object.entries(reel).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
					if (!num) {
						num = value;
					}
					else if (num !== value) {
						win = false;
					}
				});

				const outcome = `${icons[reel[0]]} | ${icons[reel[1]]} | ${icons[reel[2]]}`;

				let content = '';
				// If currency not enabled, just output here...
				if (!client.settings.currency.enabled || risk === 0) {
					if (win) {
						content += `@${viewer}, you got ${outcome} and won!`;
					}
					else {
						content += `@${viewer}, you got ${outcome} and lost!`;
					}

					client.say(channel, `${content}`);
				}
				// If it is, we have work to do...
				else if (client.settings.currency.enabled && risk > 0) {

					client.commands.global.coins.coincount.execute(client, tags)
						.then((coinAmt) => {
							coinAmt = parseInt(coinAmt);
							if (coinAmt) {
								if (risk <= coinAmt) {
									content += `@${viewer}, you got ${outcome}`;

									let riskFinal = '';
									let reason = '';

									if (win) {
										content += ` and won ${risk} ${(risk > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}!`;
										content += ` Total ${((coinAmt + risk) > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}: ${coinAmt + risk}.`;

										riskFinal = risk;
										reason = `Slots Win: ${riskFinal}`;

										// Add coins
										const args2 = ['!coins', 'add', tags.username, risk, `Slots Win: ${risk}` ];
										const message2 = `!coins add ${tags.username} ${risk} Slots Win: ${risk}`;
										tags['silent'] = true;
										client.commands.global.coins.actions.add.execute(args2, tags, message2, channel, client);
									}
									else {
										content += ` and lost ${risk} ${(risk > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}!`;
										content += ` Total ${((coinAmt - risk) > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}: ${coinAmt - risk}.`;

										riskFinal = (risk * -1);
										reason = `Slots Loss: ${riskFinal}`;
									}

									// Handle coins
									const args2 = ['!coins', 'add', tags.username, riskFinal, reason ];
									const message2 = `!coins add ${tags.username} ${riskFinal} ${reason}`;
									tags['silent'] = true;
									client.commands.global.coins.actions.add.execute(args2, tags, message2, channel, client);
								}
								else {
									content += `@${viewer}, you only have ${coinAmt} ${(coinAmt > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
								}
							}
						})
						.catch(err => console.log(err))
						.finally(function() {
							client.say(channel, `${content}`);
						});

				}
			},
		},
	},
};

const isNumeric = function(num) {
	const temp = num.toString();
	return !isNaN(parseFloat(num)) && isFinite(num) && (temp.indexOf('.') == -1);
};

const getWeightedSlot = function(max, weight = false, match = false) {
	if (weight) {
		if (weight != 0) {
			// Generate WEIGHT amount of buffers to increase match chances
			const weightValues = [];

			// Check for bad math
			if (max > weight) {
				for (let index = 0; weightValues.length < weight; index++) {
					const value = getRandomNumber(max, [ match ]);
					if (!weightValues.includes(value) && value != match) {
						weightValues.push(value);
					}
				}
			}
			else {
				weightValues.push(getRandomNumber(max));
			}

			// Generate random chance to match
			const matchChance = getRandomNumber(max);
			if (weightValues.includes(matchChance)) {
				return match;
			}
			else {
				return matchChance;
			}
		}
		else {
			return getRandomNumber(max);
		}
	}
	else {
		return getRandomNumber(max);
	}
};

const getRandomNumber = function(max, exclude = []) {
	const baseNumbers = [];

	// Make a list of all numbers between 0 and max
	let i;
	for (i = 1; i <= max; i++) {
		baseNumbers.push(i);
	}

	// Remove any exludes
	if (exclude.length > 0) {
		exclude.forEach((element) => {
			if (element != false) {
				if (baseNumbers.indexOf(element) != -1) {
					baseNumbers.splice(baseNumbers.indexOf(element), 1);
				}
			}
		});
	}

	// Prep the rolls
	const rolls = baseNumbers;
	const rolls2 = [];
	const rolls3 = [];
	const rolls4 = [];
	const rolls5 = [];
	let finalRolls = [];

	// Now shuffle them
	shuffle(rolls);

	if (rolls.length > 2) {
		// Reduce those
		const rollsLength = Math.floor(rolls.length / 2);
		for (i = 0; rolls2.length < rollsLength; i++) {
			const selected = Math.floor(Math.random() * rolls.length);
			const value = rolls[selected];
			rolls2.push(value);
			rolls.splice(selected, 1);
		}
		finalRolls = rolls2;
	}

	if (rolls2.length > 2) {
		const rolls2Length = Math.floor(rolls2.length / 2);
		for (i = 0; rolls3.length < rolls2Length; i++) {
			const selected = Math.floor(Math.random() * rolls2.length);
			const value = rolls2[selected];

			rolls3.push(value);
			rolls2.splice(selected, 1);
		}
		finalRolls = rolls3;
	}

	if (rolls3.length > 2) {
		// Reduce those
		const rolls3Length = Math.floor(rolls3.length / 2);
		for (i = 0; rolls4.length < rolls3Length; i++) {
			const selected = Math.floor(Math.random() * rolls3.length);
			const value = rolls3[selected];

			rolls4.push(value);
			rolls3.splice(selected, 1);
		}
		finalRolls = rolls4;
	}

	if (rolls4.length > 2) {
		// Reduce those
		const rolls4Length = Math.floor(rolls4.length / 2);
		for (i = 0; rolls5.length < rolls4Length; i++) {
			const selected = Math.floor(Math.random() * rolls4.length);
			const value = rolls4[selected];

			rolls5.push(value);
			rolls4.splice(selected, 1);
		}
		finalRolls = rolls5;
	}

	// Pick the winner!
	const winner = finalRolls[Math.floor(Math.random() * finalRolls.length)];

	return winner;
};

const shuffle = function(array) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex],
		];
	}
};