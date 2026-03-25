import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('notify-roles')
		.setDescription('Command to output role options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
}

export async function execute(interaction, client){

    const notify_roles = client.settings.notify_roles;

    await interaction.deferReply();

    const size = Object.keys(notify_roles.buttons).length;
    const runs = Math.ceil(size / 5);

    const rows = [];
    for (let index = 1; index <= runs; index++) {

        let i = 1;
        const row = new ActionRowBuilder();
        for (const [key, data] of Object.entries(notify_roles.buttons)) {
            if (i > (5 * (index - 1)) && i <= (5 * index)) {
                const unique = key.replace('/', '-');
                if (data.icon !== '') {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('notifyRoles_' + unique)
                            .setLabel(client.functions.ucwords(key))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(data.icon),
                    );
                }
                else {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('notifyRoles_' + unique)
                            .setLabel(client.functions.ucwords(key))
                            .setStyle(ButtonStyle.Primary),
                    );
                }
            }
            i++;
        }
        rows.push(row);
    }

    // Buttons!
    const message = await interaction.fetchReply();
    interaction.deleteReply();

    const channel = interaction.client.channels.cache.get(message.channelId);
    channel.send({ content: notify_roles.message, components: rows });

};