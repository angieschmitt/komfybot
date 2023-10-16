module.exports = {
	name: 'raid',
	description: 'Displays the raid text',
	help: 'Displays the raid text',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				content += 'komfykRaid komfykPop POPPING KOMFY RAID komfykPop komfykRaid';

				client.say(channel, `${content}`)
					.then(() => {
						setTimeout(() => {
							client.say(channel, 'Never forget that you matter, that you deserve great things & that I love you!');
						}, 6000);
					});
			},
		},
	},
};