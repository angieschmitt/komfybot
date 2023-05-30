require('./globals');

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require(configFile); // eslint-disable-line
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {

		const myPromise = new Promise((resolve) => {
			setTimeout(() => {
				resolve('foo');
			}, 500);
		});

		myPromise
			// .then(() => {
			// 	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
			// 		.then(() => console.log('Successfully deleted all guild commands.'))
			// 		.catch(console.error);
			// })
			// .then(() => {
			// 	rest.put(Routes.applicationCommands(clientId), { body: [] })
			// 		.then(() => console.log('Successfully deleted all application commands.'))
			// 		.catch(console.error);
			// })
			.then(() => {
				rest.put(Routes.applicationCommands(clientId), { body: commands })
					.then(() => console.log('Successfully reloaded all application (/) commands'))
					.catch(console.error);
			});
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
