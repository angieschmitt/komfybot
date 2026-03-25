import axios from 'axios';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('quotes')
		.setDescription('Quotable quotes.')
};

export async function execute(interaction, client){

    await interaction.deferReply();

    await axios.get(client.endpoint + 'data/quote/' + client.userID)
        .then(function(response) {

            const output = response.data;

            if (output.status === 'success') {
                const embed = new EmbedBuilder()
                    .setColor(0xC44578)
                    .setTitle('Kiwi Quotes')
                    .setThumbnail('https://api.komfybot.com/discord/2/images/komfy-kiwi.jpg')
                    .addFields(
                        { name: output.response.twitchUsername + ' once said...', value: output.response.content },
                    );

                interaction.editReply({ embeds: [embed] });
            }
            else {
                interaction.editReply({ content: 'Something went wrong?' });
            }

        })
        .catch(function(error) {
            interaction.editReply({ content: `Something went wrong? ${error}` });
        })
        .finally(function() {
            // always executed
        });

};