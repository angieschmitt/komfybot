require('../globals');

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

			await interaction.deferReply({ ephemeral: true });

			if (buttonInfo[0] == 'pronouns') {
				const { pronouns } = require(configFile); // eslint-disable-line
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === pronouns.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === pronouns.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${which} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${which} role.`, ephemeral: true });
				}
			}
			else if (buttonInfo[0] == 'notifyRoles') {
				const { notify_roles } = require(configFile); // eslint-disable-line
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === notify_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === notify_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, ephemeral: true });
				}
			}
			else if (buttonInfo[0] == 'ruleRoles') {
				const { channels, rule_roles } = require(configFile); // eslint-disable-line

				for (let i = 0; i < rule_roles.roles.length; i++) {
					member.roles.add(rule_roles.roles[i]);
				}

				interaction.editReply({ content: 'Welcome to the Komfy Krew!', ephemeral: true });

				if (!member.roles.cache.some(r => r.id === rule_roles.roles[0])) {
					interaction.client.channels.fetch(channels.just_joined)
						.then(channel => {
							channel.send({ content: `Hey everyone, <@${member.user.id}> just joined, make sure to give them a warm welcome! <:KiwiLove:1127968221987868736>` });
						});
				}
			}
			else if (buttonInfo[0] == 'miscRoles') {
				const { misc_roles } = require(configFile); // eslint-disable-line
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === misc_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === misc_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, ephemeral: true });
				}
			}
			else if (buttonInfo[0] == 'pingRoles') {
				const { ping_roles } = require(configFile); // eslint-disable-line
				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === ping_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === ping_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, ephemeral: true });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, ephemeral: true });
				}
			}
			else {
				interaction.editReply({ content: `You clicked a ${buttonInfo[0]} button. Specifically the ${buttonInfo[1]} one.`, ephemeral: true });
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