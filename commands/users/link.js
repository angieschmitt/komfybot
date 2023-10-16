require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link your Twitch and Discord accounts for KomfyBot')
		.addStringOption(option =>
			option
				.setName('twitch_username')
				.setDescription('The username to link')
				.setRequired(true)),
	async execute(interaction) {

		await interaction.deferReply({ ephemeral: true });

		const discord_id = interaction.user.id;
		const twitch_username = interaction.options.getString('twitch_username');

		const url = global.baseUrl + 'insert/link/?discord_id=' + encodeURIComponent(discord_id) + '&twitch_username=' + encodeURIComponent(twitch_username);
		await axios.get(url)
			.then(function(response) {
				const outcome = response.data;
				if (outcome.status === 'success') {
					interaction.editReply({ content: `Account successfully linked to https://twitch.tv/${twitch_username}.`, ephemeral: true });
				}
				else if (outcome.status === 'failure') {
					if (outcome.err_msg === 'already_linked') {
						interaction.editReply({ content: `Looks like your account is already linked to https://twitch.tv/${outcome.content}.`, ephemeral: true });
					}
					else if (outcome.err_msg === 'no_match') {
						interaction.editReply({ content: 'Username not found in our database. Make sure you chat in Kiwi\'s stream to fix that!', ephemeral: true });
					}
				}
				else {
					interaction.editReply({ content: 'There was an issue adding that to the database.', ephemeral: true });
				}
			})
			.catch(function(error) {
				interaction.editReply({ content: `Something went wrong? ${error}`, ephemeral: true });
			})
			.finally(function() {
				// always executed
			});
	},
};