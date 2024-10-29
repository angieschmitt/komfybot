require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { urls, apiKey } = require(configFile); // eslint-disable-line

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
		const client = interaction.client;

		await interaction.deferReply();
		let user = (interaction.options.getString('username') ? interaction.options.getString('username') : interaction.user.username);

		if (user.startsWith('<')) {
			const temp = user.replaceAll(/[<>@]/gi, '');
			const userData = await client.users.fetch(temp).catch(console.error);
			user = userData.username;
		}

		await axios.get(urls.baseUrl + 'retrieve/coins/?username=' + user)
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