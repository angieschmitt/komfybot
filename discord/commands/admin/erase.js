require('../../data/globals');

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { permissions, messages } = require(configFile); // eslint-disable-line

module.exports = {
	data: new SlashCommandBuilder()
		.setName('erase')
		.setDescription('Deletes previous messages')
		.addIntegerOption(option =>
			option
				.setName('quantity')
				.setDescription('How many messages should I delete?'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

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
			await interaction.reply({ content: 'Working on it!', ephemeral: true });

			const quantity	= interaction.options.getInteger('quantity') ?? 1;

			// let error = false;
			loopingFunction(quantity, interaction);
		}
		else {
			await interaction.reply({ content: 'That command is not for you, and has been logged.', ephemeral: true });
		}

	},
};

async function loopingFunction(goal, interaction, messageID = false) {
	if (!messageID) {
		messageID = interaction.id;
	}

	let chunk = 0;
	if (goal >= 100) {
		chunk = 100;
	}
	else {
		chunk = goal;
	}

	const result = await actuallyDeleteThings(chunk, interaction, messageID);
	console.log('Promise resolved: ' + result);
	if ((goal - 100) > 0 && result !== true) {
		loopingFunction((goal - 100), interaction, result);
	}
	else {
		interaction.editReply('Messages erasing, please be patient.');
	}
}

function actuallyDeleteThings(amount, interaction, before) {
	return new Promise((resolve, reject) => {
		let count = 1;
		let lastMessage = false;
		const channel = interaction.channel;
		channel.messages.fetch({ limit: amount, cache: false, before: before })
			.then(messageList => {

				// If 100, we drop 1
				if (amount === 100) {
					// Define the last message
					messageList.forEach(message => {
						if (count == messageList.size) {
							lastMessage = message.id;
						}
						count++;
					});

					// Now we loop over messages
					messageList.forEach(message => {
						// If it's not the defined lastMessage, we do stuff
						if (message.id !== lastMessage) {
							setTimeout(
								() => {
									// console.log('Delete ' + message.id);
									message.delete();
								},
								1000,
							);
						}
					});
				}
				else {
					messageList.forEach(message => {
						setTimeout(
							() => {
								message.delete();
							},
							1000,
						);
					});
					lastMessage = true;
				}
			})
			.finally(() => {
				const interval = setInterval(() => {
					if (lastMessage != false) {
						clearInterval(interval);
						resolve(lastMessage);
					}
				}, 1000);
			});
	});
}