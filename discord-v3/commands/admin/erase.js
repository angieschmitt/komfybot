import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('erase')
		.setDescription('Deletes previous messages')
		.addIntegerOption(option =>
			option
				.setName('quantity')
				.setDescription('How many messages should I delete?'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
};

export async function execute(interaction, client) {
		
    const permissions = client.settings.permissions;

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
        await interaction.reply({ content: 'Working on it!', flags: MessageFlags.Ephemeral });

        const quantity	= interaction.options.getInteger('quantity') ?? 1;

        // let error = false;
        client.functions.loopingFunction(quantity, interaction);
    }
    else {
        await interaction.reply({ content: 'That command is not for you, and has been logged.', flags: MessageFlags.Ephemeral });
    }

};