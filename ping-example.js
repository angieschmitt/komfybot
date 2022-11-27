const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {

		const locales = {
			de: 'Pöng',
		};

		// Public response
		// await interaction.reply('Pong!');

		// Private response
		// await interaction.reply({ content: 'Secret Pong!', ephemeral: true });

		// Defer, then edit
		await interaction.deferReply();

		// Delay
		await wait(2000);

		// Edit reply
		await interaction.editReply(locales[interaction.locale] ?? 'Pong?');

		// Follow up
		// await interaction.followUp('Pong again!');

		// Delete sent message
		// await interaction.deleteReply();
	},
};