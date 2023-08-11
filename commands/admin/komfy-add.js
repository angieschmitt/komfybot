require('../../globals');

const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('komfy-add')
		.setDescription('Command to add content to the database')
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
				.setName('content')
				.setDescription('The content to add')
				.setRequired(true)),
	async execute(interaction) {

		await interaction.deferReply();

		const category = interaction.options.getString('category');
		const content = interaction.options.getString('content');

		const url = global.baseUrl + 'insert/' + encodeURIComponent(category) + '/?content=' + encodeURIComponent(content);

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
						)
						.setTimestamp();

					interaction.editReply({ embeds: [embed], ephemeral: true });
				}
				else {
					interaction.editReply({ content: 'There was an issue adding that to the database.', ephemeral: true });
				}

			})
			.catch(function(error) {
				interaction.editReply({ content: `Something went wrong? ${error}`, ephemeral: true });
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