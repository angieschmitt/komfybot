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
				for (let index = 0; chances.length < 10; index++) {
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
								message.react('⛔');
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
	const rolls4 = [];
	const rolls5 = [];
	let finalRolls = [];

	let i;
	for (i = 1; i <= max; i++) {
		// rolls.push(Math.floor(Math.random() * max) + 1);
		rolls.push(i);
	}

	if (rolls.length > 2) {
		// Reduce those
		const rollsLength = Math.floor(rolls.length / 2);
		for (i = 0; rolls2.length < rollsLength; i++) {
			const selected = Math.floor(Math.random() * rolls.length);
			const value = rolls[selected];
			rolls2.push(value);
			rolls.splice(selected, 1);
		}
		finalRolls = rolls2;
	}

	if (rolls2.length > 2) {
		const rolls2Length = Math.floor(rolls2.length / 2);
		for (i = 0; rolls3.length < rolls2Length; i++) {
			const selected = Math.floor(Math.random() * rolls2.length);
			const value = rolls2[selected];
			rolls3.push(value);
			rolls2.splice(selected, 1);
		}
		finalRolls = rolls3;
	}

	if (rolls3.length > 2) {
		// Reduce those
		const rolls3Length = Math.floor(rolls3.length / 2);
		for (i = 0; rolls4.length < rolls3Length; i++) {
			const selected = Math.floor(Math.random() * rolls3.length);
			const value = rolls3[selected];
			rolls4.push(value);
			rolls3.splice(selected, 1);
		}
		finalRolls = rolls4;
	}

	if (rolls4.length > 2) {
		// Reduce those
		const rolls4Length = Math.floor(rolls4.length / 2);
		for (i = 0; rolls5.length < rolls4Length; i++) {
			const selected = Math.floor(Math.random() * rolls4.length);
			const value = rolls4[selected];
			rolls5.push(value);
			rolls4.splice(selected, 1);
		}
		finalRolls = rolls5;
	}

	// Pick the winner!
	const winner = finalRolls[Math.floor(Math.random() * finalRolls.length)];

	return winner;
};