require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { urls, apiKey } = require(configFile); // eslint-disable-line

axios.defaults.headers.common['Authorization'] = apiKey;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Magic 8 Ball, tell me my future!')
		.addStringOption(option =>
			option
				.setName('question')
				.setDescription('Ask the amazing 8ball anything!')
				.setRequired(true)),
	async execute(interaction) {

		const question = interaction.options.getString('question');

		await interaction.deferReply();

		await axios.get(urls.finalUrl + '8ball/retrieve')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Magic 8 Ball')
						.setThumbnail('https://kittenangie.com/bots/images/8ball.png')
						.addFields(
							{ name: question, value: output.response },
						)
						.setTimestamp();

					interaction.editReply({ embeds: [embed] });
				}
				else {
					interaction.editReply({ content: 'Something went wrong?' });
				}

			})
			.catch(function(error) {
				interaction.editReply({ content: `Something went wrong? ${error}` });
			})
			.finally(function() {
				// always executed
			});
	},
};