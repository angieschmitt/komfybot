module.exports = {
	name: 'raid',
	help: 'Displays the raid text',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command',
			},
			execute(args, tags, message, channel, client) {

				client.say(channel, 'SUBS: komfykRaid komfykDuck KOOL KOMFY RAID komfykDuck komfykRaid')
					.then(() => {
						setTimeout(() => {
							client.say(channel, 'FOLLOWERS: DinoDance <3 DANCING KIWI RAID <3 DinoDance')
								.then(() => {
									setTimeout(() => {
										client.say(channel, 'Never forget that you matter, that you deserve great things & that I love you!');
									}, 3000);
								});
						}, 3000);
					});
			},
		},
	},
};