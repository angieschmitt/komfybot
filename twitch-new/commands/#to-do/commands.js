module.exports = {
	list: false,
	name: 'commands',
	help: 'Outputs a list of available commands',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				client.say(channel, '@kittenAngie is still working on updating this!');

				// let output = 'KomfyBot has the following commands: ';
				// Object.entries(client.commands).forEach(([key, value]) => {
				// 	let cmdOut = true;
				// 	if ('disabled' in value) {
				// 		if (value.disabled == true) {
				// 			cmdOut = false;
				// 		}
				// 	}
				// 	if ('list' in value) {
				// 		if (value.list == false) {
				// 			cmdOut = false;
				// 		}
				// 	}
				// 	if (cmdOut == true) {
				// 		output += '!' + key + ', ';
				// 	}
				// });
				// output = output.trim().slice(0, -1);

				// client.say(channel, `${output}. For more information, use !help <command>.`);
			},
		},
	},
};