require('../data/globals');

const { Events } = require('discord.js');
const { channels, messages, roles } = require(configFile); // eslint-disable-line

const axios = require('axios');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const discordData = { 'id': message.author.id, 'username': message.author.username };
		await axios.get(global.baseUrl + 'insert/user_reference/?discord=' + encodeURIComponent(JSON.stringify(discordData))).catch(console.error);

		const categories = ['1127069748157481020', '1045082408233484331', '1156573567937429514'];
		// const categories = ['1045086819714347119'];

		const channel = message.channel;
		if (categories.includes(channel.parentId)) {
			if (message.author.username !== 'Komfy Bot') {
				const chances = [];
				for (let index = 0; chances.length < 5; index++) {
					const check = getRandomNumber(100);
					if (!chances.includes(check)) {
						chances.push(check);
					}
				}
				const value = getRandomNumber(100);
				// const value = chances[0];
				const data = { 'amt': 10, 'ident_type': 'discord_username', 'ident': message.author.username, 'reason': 'Chatting in discord' };
				if (chances.includes(value)) {
					message.react('🪙');
					await axios.get(global.baseUrl2 + 'coins/insert/json/' + encodeURIComponent(JSON.stringify(data)))
						.then(function(response) {
							const outcome = response.data;

							let content = '';
							if (outcome.status === 'success') {
								content = `KC_HANDOUT, SUCCESS, <@${message.author.id}>, 10, false`;
							}
							else if (outcome.status === 'failure') {
								message.react('❌');
								content = `KC_HANDOUT, FAILURE, <@${message.author.id}>, 0, ${outcome.response}`;
							}

							message.channel.client.channels.fetch(channels.bot_log)
								.then(channel => {
									channel.send({
										content: `${content}`,
									});
								})
								.catch(err => console.log(err));
						})
						.catch(console.error);
				}
			}
		}
	},
};

const getRandomNumber = function(max) {
	const rolls = [];
	const rolls2 = [];
	const rolls3 = [];

	let i;
	for (i = 0; i < 10000; i++) { rolls.push(Math.floor(Math.random() * max) + 1); }
	for (i = 0; i < 1000; i++) { rolls2.push(rolls[Math.floor(Math.random() * rolls.length)]); }
	for (i = 0; i < 100; i++) { rolls3.push(rolls2[Math.floor(Math.random() * rolls2.length)]); }
	return rolls3[Math.floor(Math.random() * rolls3.length)];
};