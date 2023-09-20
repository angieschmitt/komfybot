require('../globals');

const { Events } = require('discord.js');
const { messages, roles } = require(configFile); // eslint-disable-line

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

		const chances = [];
		for (let index = 0; index < 10; index++) {
			chances.push(getRandomNumber(100));
		}
		const value = getRandomNumber(100);

		if (chances.includes(value)) {
			message.react('🪙');
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