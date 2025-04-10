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

		const jsonData = {
			'id': interaction.user.id,
			'ident_type': 'discord_id',
			'data': {
				'discord_username': interaction.user.username,
				'twitch_username': (interaction.options.getString('twitch_username') ?? ''),
				'opt_out': (interaction.options.getBoolean('opt_out') ?? ''),
			},
		};
		const url = urls.finalUrl + 'userdata/update/json/' + encodeURIComponent(JSON.stringify(jsonData));

        console.log(url);

		await axios.get(url)
			.then(function(response) {
				let content = '';
				const debug = [];
				const outcome = response.data;
				if (outcome.status === 'success') {

					// If twitch username was provided...
					if (jsonData.data.twitch_username !== '') {
						if (outcome.response.linked == true) {
							content += `Account successfully linked to https://twitch.tv/${outcome.response.twitch_username} `;
							debug.push(`LINK, SUCCESS, ${interaction.user.username}, ${outcome.response.twitch_username}, false`);
						}
						else {
							content += 'There was an issue linking your account ';
							debug.push(`LINK, FAILURE, ${interaction.user.username}, ${outcome.response.twitch_username}, false`);
						}
					}

					// If opt out provided...
					if (jsonData.data.opt_out == true) {
						if (outcome.response.opt_out == '1') {
							if (content != '') {
								content += 'and you have opted out of the link functionality! ';
							}
							else {
								content += 'You have opted out to the link functionality! ';
							}
							debug.push(`LINK, OPT_OUT, ${interaction.user.username}, success, false`);
						}
						else {
							if (content != '') {
								content += ' and there was an issue opting out of the link functionality. Tell kittenAngie. ';
							}
							else {
								content += 'There was an issue opting out of the link functionality. Tell kittenAngie. ';
							}
							debug.push(`LINK, OPT_OUT, ${interaction.user.username}, failure, false`);
						}
					}
					else if (jsonData.data.opt_out == false) {
						if (outcome.response.opt_out == '0') {
							if (content != '') {
								content += 'and you have opted in to the link functionality! ';
							}
							else {
								content += 'You have opted in to the link functionality! ';
							}
							debug.push(`LINK, OPT_IN, ${interaction.user.username}, success, false`);
						}
						else {
							if (content != '') {
								content += ' and there was an issue opting in to the link functionality. Tell kittenAngie. ';
							}
							else {
								content += 'There was an issue opting in to the link functionality. Tell kittenAngie. ';
							}
							debug.push(`LINK, OPT_IN, ${interaction.user.username}, failure, false`);
						}
					}
				}
				else if (outcome.status === 'failure') {
					if (outcome.err_msg === 'already_linked') {
						content += 'Looks like that twitch account is already linked. If that is incorrect, tell kittenAngie. ';
						debug.push(`LINK, FAILURE, ${interaction.user.username}, ${jsonData.data.twitch_username}, already_linked, false`);
					}
					else if (outcome.err_msg === 'no_match') {
						content += 'Username not found in our database. Make sure you chat in Kiwi\'s stream to fix that!';
						debug.push(`LINK, FAILURE, ${interaction.user.username}, ${jsonData.data.twitch_username}, no_match`);
					}
					else if (outcome.err_msg === 'no_updates') {
						// OUTPUT CUSTOM MESSAGE FOR NO UPDATES
						content += `Account status: ${(outcome.response.linked == true ? 'Linked to ' + outcome.response.twitch_username : 'Not Linked')}, ${(outcome.response.opt_out == '0' ? 'Opted In' : 'Opted Out')}.`;
						// debug.push(`LINK, FAILURE, ${interaction.user.username}>, ${outcome.response.twitch_username}, no_match`);
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
				interaction.editReply({ content: `Something went wrong? ${error}`, ephemeral: true });
			})
			.finally(function() {
				// always executed
			});
	},
};