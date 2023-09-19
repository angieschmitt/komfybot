require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coins')
		.setDescription('Check a KomfyCoin wallet')
		.addStringOption(option =>
			option
				.setName('username')
				.setDescription('Twitch Username')
				.setRequired()),
	async execute(interaction) {

		await interaction.deferReply();

		const twitchUser = interaction.options.getString('username');

		await axios.get(global.baseUrl + 'retrieve/coins/?username=' + twitchUser)
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('KomfyCoin Wallet for ' + twitchUser)
						.addFields(
							{ name: 'KomfyCoin', value: (output.total ? output.total : 0) },
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