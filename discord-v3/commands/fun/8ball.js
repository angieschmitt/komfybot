import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Magic 8 Ball, tell me my future!')
		.addStringOption(option =>
			option
				.setName('question')
				.setDescription('Ask the amazing 8ball anything!')
				.setRequired(true));
}

export async function execute(interaction, client){

    const question = interaction.options.getString('question');

    await interaction.deferReply();

    const answers = [
        'It is certain',
        'It is decidedly so',
        'Without a doubt',
        'Yes definitely',
        'You may rely on it',
        'As I see it, yes',
        'Most likely',
        'Outlook good',
        'Yes',
        'Signs point to yes',
        'Reply hazy, try again',
        'Ask again later',
        'Better not tell you now',
        'Cannot predict now',
        'Concentrate and ask again',
        'Don\'t count on it',
        'My reply is no',
        'My sources say no',
        'Outlook not so good',
        'Very doubtful',
    ];

    client.functions.shuffle(answers);

    const answer = answers[Math.floor(Math.random() * answers.length)];
    const embed = new EmbedBuilder()
        .setColor(0xC44578)
        .setTitle('Magic 8 Ball')
        .setThumbnail('https://api.komfybot.com/discord/2/images/8ball.png')
        .addFields(
            { name: question, value: answer },
        )
        .setTimestamp();

    interaction.editReply({ embeds: [embed] });
    
}