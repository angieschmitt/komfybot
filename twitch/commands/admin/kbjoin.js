const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	list: false,
	name: 'kbjoin',
	help: 'Join a channel',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot your channel to join!',
			},
			execute(args, tags, message, channel, client) {

				console.log(args);

				// Handle output toggle
				let silent = false;
				if (args[2] && args[2] == 'true') {
					silent = true;
				}

				const channelToJoin = args[1].replace('@', '').toLowerCase();
				client.join(channelToJoin)
					.then(() => {
						client.say(channel, `Joined ${channelToJoin}.`);
						if (!silent) {
							client.say(channelToJoin, data.functions.speakConvertor(`Hi! Hello! ${tags.username} sent me here!`));
						}

						// Add to channel list, and prep external commands
						client.opts.channels.push('#' + channelToJoin);
						client.commands[ channelToJoin ] = {};

						// Add extras?
						client.extras[ channelToJoin ] = [];
						client.extras[ channelToJoin ].race = [];
						client.extras[ channelToJoin ].firstMessage = [];

						// Trigger reload of commands
						tags['silent'] = true;
						client.commands.global.reload.actions.commands.execute(args, tags, message, channel, client);
                        client.commands.global.reload.actions.timers.execute(args, tags, message, channel, client);
                        client.commands.global.reload.actions.settings.execute(args, tags, message, channel, client);
					})
					.catch((error) => {
						data.debug.write(channel, 'JOIN_ERROR', error);
					});
			},
		},
	},
};