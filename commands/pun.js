const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('puns')
		.setDescription('Command to setup role assignments, run in channel with message'),
	async execute(interaction) {

		await axios.get('https://kittenangie.com/bots/api/endpoint.php?request=pun')
			.then(function(response) {
				interaction.reply({ content: response.data });
			})
			.catch(function(error) {
				interaction.reply({ content: `Something went wrong? ${error}` });
			})
			.finally(function() {
				// always executed
			});
	},
};