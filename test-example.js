const { SlashCommandBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test command, target, category, input')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The user')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Funny', value: 'gif_funny' },
					{ name: 'Meme', value: 'gif_meme' },
					{ name: 'Movie', value: 'gif_movie' },
				))
		.addStringOption(option =>
			option
				.setName('input')
				.setDescription('The random input')),
	async execute(interaction) {

		const user		= interaction.options.getUser('target');
		const category	= interaction.options.getString('category');
		const input		= interaction.options.getString('input') ?? 'No reason provided';

		await interaction.reply(`User: ${user.username}. Category: ${category}. Input: ${input}.`);

		// console.log( option );
		// await interaction.editReply('Test?');
	},
};