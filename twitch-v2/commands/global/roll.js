module.exports = {
	name: 'roll',
	help: 'Roll a die and get a number!',
	aliases: {},
	actions: {
		default: {
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the die you want to roll!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const username = tags['username'];
				const dice = message.replace(args[0], '').trim().toLowerCase();

				const operators = [''];
				let total = 0;

				// Do some stuff!
				const parts = dice.split(/[+/*-]+/);
				const ops = dice.replace(/[0-9a-zA-Z ]+/gi, '');

				// Check for missing roll count
				for (let i = 0; i < parts.length; i++) {
					const check = parts[i].split('d');
					if (check[0] == '') {
						parts[i] = '1' + parts[i];
					}
				}

				for (let i = 0; i < ops.length; i++) {
					operators.push(ops[i]);
				}

				for (let i = 0; i < parts.length; i++) {
					const part = parts[i];
					const operator = operators[i];

					// Begin overflow check
					const check = parts[i].split('d');
					if (parseInt(check[0]) > 10) {
						client.say(channel, `@${username}, that's too many dice.`).catch(() => {
							setTimeout(() => {
								client.say(channel, `@${username}, that's too many dice.`);
							}, 2500);
						});
						return;
					}
					if (parseInt(check[1]) > 20) {
						client.say(channel, `@${username}, that's too high of a die.`).catch(() => {
							setTimeout(() => {
								client.say(channel, `@${username}, that's too high of a die.`);
							}, 2500);
						});
						return;
					}

					// Now do rolly stuff
					if (parts[i].indexOf('d') > -1) {
						// Generate the numbers
						const bits = parts[i].split('d');

						const numbers = [];
						for (let i2 = 0; i2 < bits[0]; i2++) { numbers.push(getRandomNumber(bits[1])); }

						let rolls = [];
						let partTotal = 0;
						for (let i2 = 0; i2 < numbers.length; i2++) {
							partTotal += numbers[i2];
							rolls += numbers[i2] + '+';
						}

						if (operator !== '') {
							total = eval(total + operator + partTotal);
						}
						else {
							total += partTotal;
						}

						const rollsOut = rolls.substr(0, (rolls.length - 1));
						content += `${bits[0]}d${bits[1]}: ${operators[i]}${rollsOut}` + '\r\n';
					}
					else {
						total = eval(total + operator + part);
						content += `(${operators[i]}${parts[i]})` + '\r\n';
					}
				}

				content += '= ' + total;

				client.say(channel, `@${username}, here's your outcome: ${content}`).catch(() => {
					setTimeout(() => {
						client.say(channel, `@${username}, here's your outcome: ${content}`);
					}, 2500);
				});
			},
		},
	},
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