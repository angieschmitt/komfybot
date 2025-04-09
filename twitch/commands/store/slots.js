module.exports = {
	name: 'slots',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Spin the slots and (optionally) wager some of your KomfyCoins!',
	aliases: {
		'slot': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				// client.say(channel, `TEMPORARILY DISABLED`);
				// return;

				const icons = {
					1 : 'BrainSlug',
					2 : 'PogChamp',
					3 : 'PizzaTime',
					4 : 'PartyHat',
					5 : 'RaccAttack',
				};

				let content = '';
				if (args.length < 2) {
					args[1] = 0;
					// content += 'No risk means no reward... but ';
				}

				if (args.length == 2) {
					const risk = parseInt(args[1]);

					if (!isNumeric(args[1])) {
						client.say(channel, `@${tags.username}, you can only wager whole numbers of KomfyCoins.`);
						return;
					}

					// If the risk is ACTUALLY a number...
					if (isFinite(risk) || risk === 0) {
						if (risk >= 0 && risk <= 80) {
							// Now we get their current coin amount
							client.commands[channel.replace('#', '')].coins.actions.coincount.execute(tags)
								.then((coinAmt) => {
									coinAmt = parseInt(coinAmt);
									if (coinAmt || coinAmt === 0) {
										if ((risk <= parseInt(coinAmt)) || risk === 0) {

											// Weight = gen X amt of nums to increase chance of matching
											const reel = [];
											reel[0] = getWeightedSlot(5);
											reel[1] = getWeightedSlot(5, 2, reel[0]);
											reel[2] = getWeightedSlot(5, 2, reel[0]);

											let num = false;
											let win = true;
											// eslint-disable-next-line no-unused-vars
											Object.entries(reel).forEach(([key, value]) => {
												if (!num) {
													num = value;
												}
												else if (num !== value) {
													win = false;
												}
											});

											const outcome = `${icons[reel[0]]} | ${icons[reel[1]]} | ${icons[reel[2]]}`;
											content += `@${tags.username}, you got ${outcome} `;

											// Output text
											if (risk > 0) {
												if (win) {
													content += `and won ${risk} KomfyCoins! Total KomfyCoins: ${coinAmt + risk}.`;

													// Add coins
													const args2 = ['!coins', 'add', tags.username, risk, `Slots Win: ${risk}` ];
													const message2 = `!coins add ${tags.username} ${risk} Slots Win: ${risk}`;
													tags['silent'] = true;
													client.commands[channel.replace('#', '')].coins.actions.add.execute(args2, tags, message2, channel, client);
												}
												else {
													content += `and lost ${risk} KomfyCoins! Total KomfyCoins: ${coinAmt - risk}.`;

													// Remove coins
													const args2 = ['!coins', 'add', tags.username, '-' + risk, `Slots Loss: -${risk}` ];
													const message2 = `!coins add ${tags.username} -${risk} Slots Loss: -${risk}`;
													tags['silent'] = true;
													client.commands[channel.replace('#', '')].coins.actions.add.execute(args2, tags, message2, channel, client);
												}
											}
											else {
												/* eslint-disable-next-line no-lonely-if */
												if (win) {
													content += 'and won!';
												}
												else {
													content += 'and lost!';
												}
											}
										}
										else {
											content += `@${tags.username}, you can't wager more KomfyCoins than you have! (${coinAmt})`;
										}
									}
								})
								.catch(err => console.log(err))
								.finally(function() {
									client.say(channel, `${content}`);
								});
						}
						else {
							client.say(channel, `@${tags.username}, you can only wager between 0 and 80 KomfyCoins`);
						}
					}
					else {
						const what = message.replace(args[0], '').trim();
						client.say(channel, `@${tags.username}, you can't wager ${what}...`);
					}
				}
				else {
					const what = message.replace(args[0], '').trim();
					client.say(channel, `@${tags.username}, you can't wager ${what}...`);
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