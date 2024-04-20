require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coins')
		.setDescription('Check a KomfyCoin wallet, provide twitch username if different')
		.addStringOption(option =>
			option
				.setName('username')
				.setDescription('Twitch Username')
				.setRequired(false)),
	async execute(interaction) {

		await interaction.deferReply();

		const user = (interaction.options.getString('username') ? interaction.options.getString('username') : interaction.user.username);

		await axios.get(global.baseUrl + 'retrieve/coins/?username=' + user)
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('KomfyCoin Wallet for ' + user)
						.addFields(
							{ name: 'Current KomfyCoin(s)', value: (output.total ? output.total : 0) },
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