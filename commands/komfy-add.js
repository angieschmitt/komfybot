const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('komfy-add')
		.setDescription('Test command, target, category, input')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.addChoices(
					{ name: 'Quote', value: 'quote' },
					{ name: 'Pun', value: 'pun' },
				)
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('content')
				.setDescription('The content to add to the selected command')
				.setRequired(true)),
	async execute(interaction) {

		const category = interaction.options.getString('category');
		const content = interaction.options.getString('content');

		const url = 'https://kittenangie.com/bots/api/insert.php?request=' + encodeURIComponent(category) + '&content=' + encodeURIComponent(content);

		await axios.get(url)
			.then(function(response) {

				const outcome = response.data;

				if (outcome.status === 'success') {

					const embed = new EmbedBuilder()
						.setColor(0xC44578)
						.setTitle('Komfy Bot Database Updated')
						.addFields(
							{ name: `${ucwords(category)} added`, value: content },
						)
						.setFooter(
							{ text: `Inserted as ID: ${outcome.id}` },
						);

					// interaction.editReply({ content: `Successfullkomy added to ${category}s` });
					interaction.reply({ embeds: [embed], ephemeral: true });
				}
				else {
					interaction.reply({ content: 'There was an issue adding that to the database.', ephemeral: true });
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