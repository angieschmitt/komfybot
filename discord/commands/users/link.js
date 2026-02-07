require('../../data/globals');

const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { channels, urls, apiKey } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Link your Twitch and Discord accounts for KomfyBot')
		.addStringOption(option =>
			option
				.setName('twitch_username')
				.setDescription('The username to link'))
		.addBooleanOption(option =>
			option.setName('opt_out')
				.setDescription('Opt out of free KomfyCoins')),
	async execute(interaction) {

		await interaction.deferReply({ ephemeral: true });

		// const jsonData = {
		// 	'id': interaction.user.id,
		// 	'ident_type': 'discord_id',
		// 	'data': {
		// 		'discord_username': interaction.user.username,
		// 		'twitch_username': (interaction.options.getString('twitch_username') ?? false'),
		// 		'opt_out': (interaction.options.getBoolean('opt_out') ?? ''),
		// 	},
		// };

		const discordUsername = interaction.user.username;
		const twitchUsername = (interaction.options.getString('twitch_username') ?? 'skipped');
		const optOut = (interaction.options.getBoolean('opt_out') ?? 'skipped');

		await axios.get(urls.endpoint + 'user/link/' + interaction.user.id + '/' + discordUsername + '/' + twitchUsername + '/' + optOut)
			.then(function(response) {
				let content = '';
				const debug = [];
				const outcome = response.data;

				if (outcome.status === 'success') {

					// If account was already linked...
					if ('already_linked' in outcome.errors) {
						content += `It looks like your account is already linked to ${outcome.errors.already_linked}. \r\n`;
						debug.push(`LINK, FAILURE, ${interaction.user.username}, ${twitchUsername}, already_linked, false`);
					}
					if ('twitch_already_linked' in outcome.errors) {
						content += 'It looks like that twitch account is already linked to someone else. \r\n';
						debug.push(`LINK, FAILURE, ${interaction.user.username}, ${twitchUsername}, twitch_already_linked`);
					}
					if ('no_match' in outcome.errors) {
						content += `${twitchUsername} was not found in our database. Make sure you chat in Kiwi\'s stream to fix that!\r\n`;
						debug.push(`LINK, FAILURE, ${interaction.user.username}, ${twitchUsername}, no_match`);
					}

					// If twitch username was provided...
					if (twitchUsername !== 'skipped') {
						if ('twitchUsername' in outcome.response) {
							content += `Account successfully linked to https://twitch.tv/${outcome.response.twitchUsername}. \r\n`;
							debug.push(`LINK, SUCCESS, ${interaction.user.username}, ${outcome.response.twitch_username}, false`);
						}
					}
					// If opt out provided...
					if (optOut !== 'skipped') {
						if (outcome.response.syncOptOut == '1') {
							content += 'You have opted out to the link functionality!\r\n';
							debug.push(`LINK, OPT_OUT, ${interaction.user.username}, success, false`);
						}
						else if (outcome.response.syncOptOut == '0') {
							content += 'You have opted in to the link functionality!\r\n';
							debug.push(`LINK, OPT_IN, ${interaction.user.username}, success, false`);
						}
					}
				}
				else {
					content += 'There was an general issue adding that to the database. Tell kittenAngie. ';
				}

				interaction.editReply({ content: `${content}`, ephemeral: true });
				interaction.channel.client.channels.fetch(channels.bot_log)
					.then(channel => {
						debug.forEach((dbgMsg) => {
							channel.send({
								content: `${dbgMsg}`,
							});
						});
					})
					.catch(err => console.log(err));
			})
			.catch(function(error) {
				console.log('y');
				interaction.editReply({ content: `Something went wrong? ${error}`, ephemeral: true });
			})
			.finally(function() {
				// always executed
			});
	},
};