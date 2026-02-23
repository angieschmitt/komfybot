const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Because every bot needs a dice roller')
		.addStringOption(option =>
			option
				.setName('dice')
				.setDescription('Whatcha rolling?')
				.setRequired(true)),
	async execute(interaction) {

		await interaction.deferReply();

		const user		= interaction.user;
		const dice 		= interaction.options.getString('dice');

		// Setup Variables
		const operators = [''];
		let total = 0;
		let output = '';

		// Do some stuff!
		const parts = dice.split(/[+/*-]+/);
		const ops = dice.replace(/[0-9a-zA-Z ]+/gi, '');
		for (let i = 0; i < ops.length; i++) { operators.push(ops[i]); }

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const operator = operators[i];

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
				output += `${bits[0]}d${bits[1]}: ${operators[i]}${rollsOut} (${partTotal})` + '\r\n';
			}
			else {
				total = eval(total + operator + part);
				output += `Mod: ${operators[i]}${parts[i]}` + '\r\n';
			}
		}

		output += '--------' + '\r\n';
		output += 'Total: ' + total;

		const exampleEmbed = new EmbedBuilder()
			.setColor(0xC44578)
			.setTitle('Roll Outcome')
			.setThumbnail('https://api.komfybot.com/discord/2/images/dice-roller.png')
			.addFields(
				{ name: user.username + ' rolled:', value: output ?? '--' },
			)
			.setTimestamp();

		interaction.editReply({ embeds: [exampleEmbed] });
	},
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