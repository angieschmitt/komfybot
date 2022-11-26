const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (interaction.isChatInputCommand()) {
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
		}
		else {
			if (interaction.isButton()) {
				console.log(interaction);
				await interaction.reply({ content: 'You clicked it. Why would you do that?', ephemeral: true });
			}
			return;
		}

	},
};
