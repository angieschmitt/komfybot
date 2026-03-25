import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export function create(){
    return new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Because every bot needs a dice roller')
		.addStringOption(option =>
			option
				.setName('dice')
				.setDescription('Whatcha rolling?')
				.setRequired(true))
};

export async function execute(interaction, client){
    
    await interaction.deferReply();

    const user = interaction.user;
    const dice = interaction.options.getString('dice');

    // Setup Variables
    const operators = [''];
    let total = 0;
    let output = '';

    // Do some stuff!
    const parts = dice.split(/[+/*-]+/);
    const ops = dice.replace(/[0-9a-zA-Z ]+/gi, '');
    for (let i = 0; i < ops.length; i++) { operators.push(ops[i]); }

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const operator = operators[i];

        if (parts[i].indexOf('d') > -1) {

            // Generate the numbers
            const bits = parts[i].split('d');
            const numbers = [];
            for (let i2 = 0; i2 < bits[0]; i2++) { numbers.push(client.functions.getRandomNumber(bits[1])); }

            let rolls = [];
            let partTotal = 0;
            for (let i2 = 0; i2 < numbers.length; i2++) {
                partTotal += numbers[i2];
                rolls += numbers[i2] + '+';
            }

            if (operator !== '') {
                total = eval(total + operator + partTotal);
            }
            else {
                total += partTotal;
            }

            const rollsOut = rolls.substr(0, (rolls.length - 1));
            output += `${bits[0]}d${bits[1]}: ${operators[i]}${rollsOut} (${partTotal})` + '\r\n';
        }
        else {
            total = eval(total + operator + part);
            output += `Mod: ${operators[i]}${parts[i]}` + '\r\n';
        }
    }

    output += '--------' + '\r\n';
    output += 'Total: ' + total;

    const exampleEmbed = new EmbedBuilder()
        .setColor(0xC44578)
        .setTitle('Roll Outcome')
        .setThumbnail('https://api.komfybot.com/discord/2/images/dice-roller.png')
        .addFields(
            { name: user.username + ' rolled:', value: output ?? '--' },
        )
        .setTimestamp();

    interaction.editReply({ embeds: [exampleEmbed] });

};