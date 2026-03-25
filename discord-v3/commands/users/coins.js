import axios from 'axios';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('coins')
		.setDescription('Check a KomfyCoin wallet, provide twitch username if different')
		.addStringOption(option =>
			option
				.setName('username')
				.setDescription('Twitch Username')
				.setRequired(false))
}

export async function execute(interaction, client){

    await interaction.deferReply();
    let user = (interaction.options.getString('username') ? interaction.options.getString('username') : interaction.user.username);

    if (user.startsWith('<')) {
        const temp = user.replaceAll(/[<>@]/gi, '');
        const userData = await client.users.fetch(temp).catch(console.error);
        user = userData.username;
    }

    await axios.get(client.endpoint + 'coins/retrieve/' + client.userID + '/' + user)
        .then(function(response) {

            const output = response.data;

            if (output.status === 'success') {
                const embed = new EmbedBuilder()
                    .setColor(0xC44578)
                    .setTitle('KomfyCoin Wallet for ' + user)
                    .addFields(
                        { name: 'Current KomfyCoin(s)', value: (output.response ? output.response : 0) },
                    )
                    .setTimestamp();

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