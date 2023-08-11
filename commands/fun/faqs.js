require('../../globals');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { faqs } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('faqs')
		.setDescription('Frequently Asked Questions')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The FAQ category')
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

		// Buttons!
		const message = await interaction.fetchReply();
		interaction.deleteReply();

		const channel = interaction.client.channels.cache.get(message.channelId);
		channel.send({ embeds: [embed] });
		// interaction.editReply({ embeds: [embed] });

	},
};