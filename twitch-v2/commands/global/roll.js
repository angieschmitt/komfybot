const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

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
				const dice = message.substr(message.indexOf('!')).replace(args[0], '').trim().toLowerCase();
				const operators = [''];

				// Do some stuff!
				const parts = dice.split(/[+/*-]+/);
				const ops = dice.replace(/[^+/*-]/gi, '').trim();

				// Check for missing roll count
				for (let i = 0; i < parts.length; i++) {
					// If it's not just a number...
					if (!isInt(parts[i])) {
						const check = parts[i].split('d');
						// If it splits...
						if (check.length > 1) {

							// Clean out non-numbers...
							let checkAmt = check[0].replace(/[^0-9.]/g, '').trim();
							let checkSides = check[1].replace(/[^0-9.]/g, '').trim();

							if (checkAmt === '0') { checkAmt = 1; }
							if (checkSides === '0') { checkSides = 1; }

							// Handle check for Amt...
							if (checkAmt === '') { check[0] = 1; }
							else { check[0] = checkAmt; }

							// Handle check for Sides...
							if (checkSides === '') { check[1] = parts[i].replace(/[0-9.]/g, '').length; }
							else { check[1] = checkSides; }

							parts[i] = check[0] + 'd' + check[1];
						}
						// Otherwise...
						else if (check.length == 1) {
							// Get the word in here...
							const word = check[0].replace(/[0-9.]/g, '');

							if (word) {
								// Try to split based on it...
								const check2 = check[0].split(word);
								if (check2.length > 1) {
									if (check2[0] !== '') {
										if (check2[1].replace(/[a-z]/g, '') !== '') {
											parts[i] = check2[0] + 'd' + check2[1].replace(/[a-z]/g, '');
										}
										else {
											parts[i] = check2[0] + 'd' + (word.length);
										}
									}
									else if (check2[0] == '') {
										if (check2[1].replace(/[a-z]/g, '') !== '') {
											parts[i] = '1d' + check2[1].replace(/[a-z]/g, '');
										}
										else {
											parts[i] = '1d' + (word.length);
										}
									}
								}
							}
						}
					}
				}

				// Handle the operators..
				for (let i = 0; i < ops.length; i++) {
					operators.push(ops[i]);
				}

				// Now do the stuff...
				const steps = [];
				for (let i = 0; i < parts.length; i++) {

					// Only handle dice rolls here...
					if (parts[i].indexOf('d') !== -1) {

						// Begin overflow check
						const check = parts[i].split('d');
						if (parseInt(check[0]) > 20) {
							content = `@${username}, that's too many dice.`;
							functions.sayHandler(client, content);
							return;
						}
						if (parseInt(check[1]) > 100) {
							content = `@${username}, that's too high of a die.`;
							functions.sayHandler(client, content);
							return;
						}

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
						rolls = rolls.substr(0, rolls.length - 1);

						steps[i] = [];
						steps[i]['total'] = partTotal;
						steps[i]['rolls'] = rolls;
						steps[i]['amt'] = bits[0];
					}
				}

				// Now build out the output...
				let runningTotal = 0;
				for (let i = 0; i < parts.length; i++) {
					const currentOperator = operators[i];

					// Handle the first entry...
					if (currentOperator === '') {
						// If it was a die roll...
						if (steps[i]) {
							// Slap in the NEXT operator...
							if ((i + 1) in operators) {
								if (steps[i].amt > 5) {
									content += `${steps[i].total} (${parts[i]}) ${operators[i + 1]} `;
								}
								else {
									content += `${steps[i].rolls} (${parts[i]}) ${operators[i + 1]} `;
								}
							}
							else {
								if (steps[i].amt > 5) { // eslint-disable-line no-lonely-if
									content += `${steps[i].total} (${parts[i]}) `;
								}
								else {
									content += `${steps[i].rolls} (${parts[i]}) `;
								}
							}
							runningTotal = parseFloat(steps[i].total);
						}
						// Otherwise just add in the number...
						else {
							// Slap in the NEXT operator...
							if ((i + 1) in operators) {
								content += `${parts[i]} ${operators[i + 1]} `;
							}
							else {
								content += `${parts[i]} `;
							}
							runningTotal = parseFloat(parts[i]);
						}
					}
					// Now we're in operator land...
					if (currentOperator !== '') {
						// If it was a die roll...
						if (steps[i]) {
							// Slap in the NEXT operator...
							if ((i + 1) in operators) {
								content += `${steps[i].rolls} (${parts[i]}) ${operators[i + 1]} `;
							}
							else {
								content += `${steps[i].rolls} (${parts[i]}) `;
							}
							runningTotal = eval(runningTotal + operators[i] + parseFloat(steps[i].total));
						}
						// Otherwise just add in the number...
						else {
							// Slap in the NEXT operator...
							if ((i + 1) in operators) {
								content += `${parts[i]} ${operators[i + 1]} `;
							}
							else {
								content += `${parts[i]} `;
							}
							runningTotal = eval(runningTotal + operators[i] + parseFloat(parts[i]));
						}
					}
				}

				// content = 'AHHHHHHHHHH';
				content += '= ' + runningTotal;
				content = `@${username}, here's your outcome: ${content}`;
				functions.sayHandler(client, content);
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

const isInt = function(value) {
	const x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
};