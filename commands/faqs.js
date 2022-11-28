const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { faqs } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faqs')
		.setDescription('Command to setup role assignments, run in channel with message')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.setAutocomplete(true)
				.setRequired(true)),
	async autocomplete(interaction) {

		const choices = [];
		for (const [key] of Object.entries(faqs)) {
			choices.push({ name: key, value: key });
		}
		await interaction.respond(choices);

	},
	async execute(interaction) {

		await interaction.deferReply();

		const category = interaction.options.getString('category');
		const questions = faqs[category];

		const faqsOutput = [];
		for (const [question, answer] of Object.entries(questions)) {
			faqsOutput.push({ name: question, value: answer });
		}

		const embed = new EmbedBuilder()
			.setColor(0xC44578)
			.setTitle(`FAQs: ${category}`)
			.addFields(faqsOutput)
			.setTimestamp();

		interaction.editReply({ embeds: [embed] });

	},
};