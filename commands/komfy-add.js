const { SlashCommandBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('komfy-add')
		.setDescription('Test command, target, category, input')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.addChoices(
					{ name: 'Quote', value: 'quotes' },
					{ name: 'Pun', value: 'puns' },
					{ name: 'FAQ', value: 'faqs' },
				)
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('content')
				.setDescription('The content to add to the selected command')
				.setRequired(true)),
	async execute(interaction) {

		console.log(interaction);

	},
};