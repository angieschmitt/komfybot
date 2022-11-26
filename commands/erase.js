const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { permissions } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('erase')
		.setDescription('Deletes previous messages')
		.addStringOption(option =>
			option
				.setName('quantity')
				.setDescription('How many messages should I delete?'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		const member = interaction.member;

		// Permission check
		let canRun = false;
		member.roles.cache.forEach((role) => {
			if (permissions.erase.includes(role.name)) {
				canRun = true;
			}
		});

		if (canRun) {

			// Acknowledge
			await interaction.reply({ content: 'Working on it!', ephemeral: true });

			const channel 	= interaction.channel;
			const quantity	= interaction.options.getString('quantity') ?? 1;

			let count = 0;
			channel.messages.fetch({ limit: quantity }).then(messages => {
				if (messages.size > 0) {
					// Iterate through the messages here with the variable "messages".
					messages.forEach(message => {
						setTimeout(() => {
							message.delete();
							count++;
							if (count === messages.size) {
								interaction.editReply(`Erasing ${count} messages, just be patient!`);
							}
						}, 1000);
					});
				}
				else {
					interaction.editReply('Seems like there is nothing to delete.');
				}
			});

		}
		else {

			await interaction.reply({ content: 'That command is not for you, and has been logged.', ephemeral: true });

		}

	},
};