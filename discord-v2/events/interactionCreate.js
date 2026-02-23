const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction) {

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

			await interaction.deferReply({ flags: MessageFlags.Ephemeral });

			if (buttonInfo[0] == 'pronouns') {
				const pronouns = client.settings.pronouns;

				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === pronouns.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === pronouns.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${which} role.`, flags: MessageFlags.Ephemeral });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${which} role.`, flags: MessageFlags.Ephemeral });
				}
			}
			else if (buttonInfo[0] == 'notifyRoles') {
				const notify_roles = client.settings.notify_roles;

				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === notify_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === notify_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
			}
			else if (buttonInfo[0] == 'ruleRoles') {
				const rule_roles = client.settings.rule_roles;

				for (let i = 0; i < rule_roles.roles.length; i++) {
					member.roles.add(rule_roles.roles[i]);
				}

				interaction.editReply({ content: 'Welcome to the Komfy Krew!', flags: MessageFlags.Ephemeral });

				if (!member.roles.cache.some(r => r.id === rule_roles.roles[0])) {
					interaction.client.channels.fetch(client.settings.channels.just_joined)
						.then(channel => {
							channel.send({ content: `Hey everyone, <@${member.user.id}> just joined, make sure to give them a warm welcome! <:KiwiLove:1127968221987868736>` });
						})
						.catch(err => console.log(err));
				}
			}
			else if (buttonInfo[0] == 'miscRoles') {
				const misc_roles = client.settings.misc_roles;

				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === misc_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === misc_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
			}
			else if (buttonInfo[0] == 'optinRoles') {
				const optin_roles = client.settings.optin_roles;

				const which = buttonInfo[1].replace('-', '/');
				const role	= interaction.guild.roles.cache.find(r => r.id === optin_roles.buttons[which].roleID);

				if (member.roles.cache.some(r => r.id === optin_roles.buttons[which].roleID)) {
					member.roles.remove(role);
					interaction.editReply({ content: `Removing the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
				else {
					member.roles.add(role);
					interaction.editReply({ content: `Adding the ${ucwords(which)} role.`, flags: MessageFlags.Ephemeral });
				}
			}
			else {
				interaction.editReply({ content: `You clicked a ${buttonInfo[0]} button. Specifically the ${buttonInfo[1]} one.`, flags: MessageFlags.Ephemeral });
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