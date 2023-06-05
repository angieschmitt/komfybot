const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('komfy-remove')
		.setDescription('Command to remove content from the database')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addStringOption(option =>
			option.setName('category')
				.setDescription('Type of content')
				.addChoices(
					{ name: 'Quote', value: 'quote' },
					{ name: 'Pun', value: 'pun' },
				)
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('content-id')
				.setDescription('The ID of the content to remove from the database')
				.setRequired(true)),
	async execute(interaction) {

		const category = interaction.options.getString('category');
		const contentId = interaction.options.getString('content-id');

		const url = 'https://kittenangie.com/bots/api/remove.php?request=' + encodeURIComponent(category) + '&content=' + encodeURIComponent(contentId);

		await axios.get(url)
			.then(function(response) {

				const outcome = response.data;

				if (outcome.status === 'success') {

					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Komfy Bot Database Updated')
						.addFields(
							{ name: `${ucwords(category)} removed`, value: outcome.content },
						)
						.setTimestamp();

					interaction.reply({ embeds: [embed], ephemeral: true });
				}
				else {
					interaction.reply({ content: 'There was an issue removing that from the database.', ephemeral: true });
				}

			})
			.catch(function(error) {
				interaction.reply({ content: `Something went wrong? ${error}`, ephemeral: true });
			})
			.finally(function() {
				// always executed
			});

	},
};

function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}