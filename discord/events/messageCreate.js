require('../data/globals');

const axios = require('axios');
const { Events } = require('discord.js');
const { channels, messages, roles, urls, apiKey } = require(configFile); // eslint-disable-line

axios.defaults.headers.common['Authorization'] = apiKey;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const discordData = { 'id': message.author.id, 'username': message.author.username };
		await axios.get(urls.baseUrl + 'insert/user_reference/?discord=' + encodeURIComponent(JSON.stringify(discordData))).catch(console.error);

		// Handle the KomfyCoin handouts
		const channel = message.channel;
		const categories = ['1045086819714347119', '1127069748157481020', '1045082408233484331', '1156573567937429514'];

		// If the message is in the appropriate categories...
		if (categories.includes(channel.parentId)) {

			// Snag the username / ID
			const userID = message.author.id;
			const username = message.author.username;

			// Skip KB messages
			if (userID === '1045127424347750401') {
				return;
			}

			// Get their lotto numbers...
			let chances = new Array();
			for (let index = 0; chances.length < 10; index++) {
				const check = getRandomNumber(100);
				if (!chances.includes(check)) {
					chances.push(check);
				}
			}
			chances = chances.sort((a, b) => a - b);

			// Select the winning number...
			const value = getRandomNumber(100);

			// If the winning number is on their card...
			if (chances.includes(value)) {

				// First, we check if their accounts are linked..
				await axios.get(urls.finalUrl + 'v1/userdata/retrieve/' + username)
					.then(function(response) {
						const outcome = response.data;
						if (outcome.status === 'success') {

							// If they are, we pay out the coins
							if (outcome.response.linked === true) {

								// Mark the message with the coin
								message.react('🪙');

								// Actually add the coins
								const data = { 'amt': 10, 'ident_type': 'discord_username', 'ident': message.author.username, 'reason': 'Chatting in discord' };
								axios.get(urls.baseUrl2 + 'coins/insert/json/' + encodeURIComponent(JSON.stringify(data)))
									.then(function(response) {
										const outcome = response.data;

										let content = '';
										if (outcome.status === 'success') {
											content = `KC_HANDOUT, SUCCESS, <@${message.author.id}>, 10, false, [${chances}], [${value}]`;
										}
										else if (outcome.status === 'failure') {
											message.react('‼️');
											message.reply({ content: `<@${userID}>, something went wrong! I'll ping <@215630012060139522>!` });
											content = `KC_HANDOUT, FAILURE, <@${message.author.id}>, 0, ${outcome.err_msg}, [${chances}], [${value}]`;
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
							// If not, we alert them to the /link command
							else {
								message.reply({ content: `<@${userID}>, I attempted to give you free 🪙 KomfyCoins, but you haven't linked your Twitch account! To make sure you don't miss any in the future, make sure you use the /link command!` });
							}

						}
						// If we're here, something went wrong...
						else {
							message.react('‼️');
							message.reply({ content: `<@${userID}>, something went wrong! I'll ping <@215630012060139522>! ErrMsg: ${outcome}` });
						}
					})
					.catch(console.error);
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

	// Add all numbers to the pull
	let i;
	for (i = 1; i <= max; i++) {
		rolls.push(i);
	}

	// Cut the list in half by moving half of them into rollsX
	// assign to finalRolls in case we're done here
	// and do that until we ARE done
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