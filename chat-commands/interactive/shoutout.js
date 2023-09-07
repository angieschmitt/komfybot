module.exports = {
	name: 'shoutout',
	description: 'Shout out a user',
	help: 'MOD command to shout out a user in chat!',
	actions: {
		default: {
			perms: {
				levels: ['mod'],
				error: 'This command is for mods only!',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				if (!args[1]) {
					client.say(channel, 'Make sure to include the user to shoutout!');
				}
				else {
					let username = '';

					if (args[1]) {
						if (args[1].indexOf('@') === 0) {
							username = args[1].substring(1);
						}
						else {
							username = args[1];
						}
					}
					else {
						username = tags.username;
					}

					content = `Go check out @${username} at https://www.twitch.tv/${username}!`;
					if (args[2]) {
						const messageOut = message.replace(args[0], '').replace(args[1], '').trim();
						content += ' ' + messageOut;
					}

					client.say(channel, content);
				}
			},
		},
	},
};