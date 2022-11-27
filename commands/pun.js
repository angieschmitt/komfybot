const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('puns')
		.setDescription('Command to setup role assignments, run in channel with message'),
	async execute(interaction) {

		await interaction.deferReply();

		await axios.get('https://kittenangie.com/bots/api/endpoint.php?request=pun')
			.then(function(response) {

				const output = response.data;

				if (output.status === 'success') {
					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Pun Delivery Service')
						.addFields(
							{ name: 'Pun:', value: output.content },
						)
						.setTimestamp()
						.setFooter(
							{ text: `ID: ${output.id}` },
						);

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