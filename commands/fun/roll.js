require('../globals');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;

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

		// console.log(parts);
		// console.log(operators);

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const operator = operators[i];

			if (parts[i].indexOf('d') > -1) {

				// console.log(part);
				// console.log(operator);

				// Generate the numbers
				const bits = parts[i].split('d');
				const numbers = [];
				for (let i2 = 0; i2 < bits[0]; i2++) { numbers.push(getRandomNumber(bits[1])); }

				// console.log('Numbers: ' + numbers);

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

				// console.log('pTotal: ' + partTotal);
				// console.log('- - - -');

				const rollsOut = rolls.substr(0, (rolls.length - 1));
				output += `${bits[0]}d${bits[1]}: ${operators[i]}${rollsOut} (${partTotal})` + '\r\n';
			}
			else {

				// console.log('Part: ' + part);
				// console.log('Operator: ' + operator);
				// console.log('Numbers: ' + part);
				// console.log('pTotal: ' + part);

				total = eval(total + operator + part);
				output += `Mod: ${operators[i]}${parts[i]}` + '\r\n';

				// console.log('- - - -');
			}
		}

		// console.log('Total: ' + total);
		output += '--------' + '\r\n';
		output += 'Total: ' + total;

		const exampleEmbed = new EmbedBuilder()
			.setColor(0xC44578)
			.setTitle('Roll Outcome')
			.setThumbnail('https://kittenangie.com/bots/images/dice-roller.png')
			.addFields(
				{ name: user.username + ' rolled:', value: output ?? '--' },
			)
			.setTimestamp();

		await interaction.editReply({ embeds: [exampleEmbed] });
	},
};

const getRandomNumber = function(max) {
	const rolls = [];
	const rolls2 = [];
	const rolls3 = [];

	let i;
	for (i = 0; i < 10000; i++) { rolls.push(Math.floor(Math.random() * max) + 1); }
	for (i = 0; i < 1000; i++) { rolls2.push(rolls[Math.floor(Math.random() * rolls.length)]); }
	for (i = 0; i < 100; i++) { rolls3.push(rolls2[Math.floor(Math.random() * rolls2.length)]); }
	return rolls3[Math.floor(Math.random() * rolls3.length)];
};