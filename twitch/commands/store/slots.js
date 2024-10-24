// const axios = require('axios');
// const dataFile = require('../../data/index');
// const data = dataFile.content();

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

											// Weight = matching X in X PER reel.
											//    - Increases chances, but I can't figure out the math
											//    - 1 = 100%, 2 = 50%, 3 = 33%
											const reel = [];
											reel[0] = getWeightedSlot(5);
											reel[1] = getWeightedSlot(5, 3, reel[0]);
											reel[2] = getWeightedSlot(5, 2, reel[1]);

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

											console.log(`Risking ${risk} `);
											console.log(reel);

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
	if (!weight) {
		return getRandomNumber(max);
	}
	else {
		const value = getRandomNumber(max);
		if (getRandomNumber(weight) == weight) {
			console.log('WEIGHTED: TRUE');
			return match;
		}
		else {
			console.log('WEIGHTED: FALSE');
			return value;
		}
	}
};

const getRandomNumber = function(max) {
	const rolls = [];
	const rolls2 = [];
	const rolls3 = [];
	const rolls4 = [];
	const rolls5 = [];
	let finalRolls = [];

	let i;
	for (i = 0; i < max; i++) {
		rolls.push(Math.floor(Math.random() * max) + 1);
	}

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