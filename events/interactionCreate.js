const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand()) return;

		const { commandName } = interaction;
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}

		// }
		// else {

		//     const { commandName } = interaction;

		//     if (commandName === 'react') {
		//         const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
		//         message.react('😄');
		//     }
		// }

	},
};
