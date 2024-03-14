module.exports = {
	name: 'slowclap',
	help: 'Slow. Clap.',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				const content = '👏';

				client.say(channel, `${content}`);

				let iter = 0;
				const clap = setInterval(() => {
					if (iter <= 2) {
						client.say(channel, `${content}`);
					}
					else {
						clearInterval(clap);
					}
					iter++;
				}, 6000);
			},
		},
	},
};