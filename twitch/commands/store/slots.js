// const axios = require('axios');
// const dataFile = require('../../data/index');
// const data = dataFile.content();

module.exports = {
	name: 'slots',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Spin the slots and (optionally) wager some of your KomfyCoins!',
	aliases: {
		// 'slots': {
		// 	arg: false,
		// 	list: false,
		// },
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
									if (coinAmt) {
										if (risk <= parseInt(coinAmt)) {

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

	let i;
	// Assign a bunch of "random rolls"
	for (i = 0; i < 10000; i++) {
		rolls.push(Math.floor(Math.random() * max) + 1);
	}
	// Lets filter that down to less rolls
	for (i = 0; i < 1000; i++) {
		const selected = Math.floor(Math.random() * rolls.length);
		rolls2.push(rolls[selected]);
		rolls.splice(selected, 1);
	}
	// More filtering
	for (i = 0; i < 100; i++) {
		const selected = Math.floor(Math.random() * rolls2.length);
		rolls3.push(rolls2[selected]);
		rolls2.splice(selected, 1);
	}
	// Pick the winner!
	const winner = rolls3[Math.floor(Math.random() * rolls3.length)];

	return winner;
};