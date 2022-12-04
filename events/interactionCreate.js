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
		else if (interaction.isButton()) {
			const buttonInfo = interaction.customId.split('_');
			const member	 = interaction.guild.members.cache.find(m => m.id === interaction.user.id);

			if (buttonInfo[0] == 'pronouns') {
				const { pronouns } = require('../config.json');
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === pronouns.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === pronouns.buttons[which].roleID)) {
					member.roles.remove(role);
					await interaction.reply({ content: `Removing the ${which} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					await interaction.reply({ content: `Adding the ${which} role.`, ephemeral: true });
				}
			}
			else if (buttonInfo[0] == 'roles') {
				const { roles } = require('../config.json');
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === roles.buttons[which].roleID)) {
					member.roles.remove(role);
					await interaction.reply({ content: `Removing the ${ucwords(which)} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					await interaction.reply({ content: `Adding the ${ucwords(which)} role.`, ephemeral: true });
				}
			}
			else {
				await interaction.reply({ content: `You clicked a ${buttonInfo[0]} button. Specifically the ${buttonInfo[1]} one.`, ephemeral: true });
			}

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
		else {
			return;
		}
	},
};

function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}