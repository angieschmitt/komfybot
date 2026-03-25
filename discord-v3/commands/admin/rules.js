import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Command to output rules')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addBooleanOption(option =>
			option.setName('button')
				.setDescription('Whether or not to output the button'))
};

export async function execute(interaction, client) {
		
    const rule_roles = client.settings.rule_roles;

    await interaction.deferReply();

    const rows = [];
    const row = new ActionRowBuilder();
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('ruleRoles_accept')
            .setLabel('I Accept')
            .setStyle(ButtonStyle.Primary),
    );
    rows.push(row);

    // Buttons!
    const message = await interaction.fetchReply();
    interaction.deleteReply();

    const channel = interaction.client.channels.cache.get(message.channelId);

    const button = (interaction.options.getBoolean('button') ?? false);

    if (button) {
        channel.send({ content: rule_roles.message, components: rows });
    }
    else {
        channel.send({ content: rule_roles.message });
    }
    
};