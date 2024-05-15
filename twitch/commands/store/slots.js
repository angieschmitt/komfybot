const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'slots',
	channel: ['komfykiwi', 'komfybot'],
	help: 'Shows your (or someone else\'s) total coin amount! Additional arguments: add, store, buy',
	aliases: {
		// 'slots': {
		// 	arg: false,
		// 	list: false,
		// },
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				// if (args.length < 1) {
				// 	client.say(channel, 'You\'ll need to choose an amount to risk! ');
				// }
				// else {
				let content = '';
				const risk = args[1];
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

				const icons = {
					1 : 'BrainSlug',
					2 : 'PogChamp',
					3 : 'PizzaTime',
					4 : 'PartyHat',
					5 : 'RaccAttack',
				};

				console.log(`Risking ${risk} `);
				console.log(reel);

				const outcome = `${icons[reel[0]]} | ${icons[reel[1]]} | ${icons[reel[2]]}`;
				content += `@${tags.username}, you got ${outcome} `;
				if (win) {
					content += 'and won!';
				}
				else {
					content += 'and lost!';
				}
				client.say(channel, content);
				// }
			},
		},
	},
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