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

				const buttonInfo = interaction.customId.split('_');

				if (buttonInfo[0] == 'pronouns') {
					// const { pronouns } = require('../config.json');
					const which = buttonInfo[1].replace('-', '/');

					// console.log(pronouns.buttons[which].roleID);

					await interaction.reply({ content: `Adding the ${which} role. Click again to remove!`, ephemeral: true });
				}
				else {
					await interaction.reply({ content: 'WHAT DID YOU CLICK!?', ephemeral: true });
				}

				// console.log(interaction);

			}
			else if (interaction.isAutocomplete()) {
				const command = interaction.client.commands.get(interaction.commandName);

				if (!command) {
					console.error(`No command matching ${interaction.commandName} was found.`);
					return;
				}

				try {
					await command.autocomplete(interaction);
				}
				catch (error) {
					console.error(error);
				}
			}
			return;
		}

	},
};
