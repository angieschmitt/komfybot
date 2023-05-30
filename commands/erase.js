const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { permissions, messages } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('erase')
		.setDescription('Deletes previous messages')
		.addIntegerOption(option =>
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
			const quantity	= interaction.options.getInteger('quantity') ?? 1;

			let error = false;
			let count = 1;
			channel.messages.fetch({ limit: quantity }).then(messageList => {
				if (messageList.size > 0) {
					// Iterate through the messages here with the variable "messages".
					messageList.forEach(message => {
						if (!messages.includes(message.id)) {
							setTimeout(() => { message.delete(); }, 1000);
						}
						else {
							error = '\r\nThere was at least one message that couldn\'t be erased.';
						}
						if (count === messageList.size) {
							if (!error) {
								interaction.editReply(`Erased ${count} messages.`);
							}
							else {
								interaction.editReply(`Erased ${count} messages, but there was an error: \r\n` + (error != false ? error : ''));
							}
						}
						count++;
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