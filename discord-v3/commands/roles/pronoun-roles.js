import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('pronoun-roles')
		.setDescription('Command to output pronoun options')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
}

export async function execute(interaction, client){

    const pronouns = client.settings.pronouns;

    await interaction.deferReply();

    const size = Object.keys(pronouns.buttons).length;
    const runs = Math.ceil(size / 5);

    const rows = [];
    for (let index = 1; index <= runs; index++) {

        let i = 1;
        const row = new ActionRowBuilder();
        for (const [key, data] of Object.entries(pronouns.buttons)) {
            if (i > (5 * (index - 1)) && i <= (5 * index)) {
                const unique = key.replace('/', '-');
                if (data.icon !== '') {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('pronouns_' + unique)
                            .setLabel(client.functions.ucwords(key))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(data.icon),
                    );
                }
                else {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('pronouns_' + unique)
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
    channel.send({ content: pronouns.message, components: rows });
	
};