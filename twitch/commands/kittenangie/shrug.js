module.exports = {
	list: false,
	name: 'shrug',
	help: 'Shrug aggressively',
	aliases: {
		'angy': {
			arg: 'angry',
		},
	},
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				let check = 0;
				const emotes = {
					'1' : '¯\\_(ツ)_/¯',
				};

				check = randomIntFromInterval(0, (Object.keys(emotes).length - 1));
				content += emotes[ Object.keys(emotes)[check] ];

				client.say(channel, `${content}`);
			},
		},
		angry: {
			help: 'ME MAKE ANGY FACE',
			execute(args, tags, message, channel, client) {
				let content = '';
				let check = 0;
				const emotes = {
					'1' : '╰（‵□′）╯',
					'2' : '(╯▔皿▔)╯',
					'3' : 'щ(゜ロ゜щ)',
				};

				check = randomIntFromInterval(0, (Object.keys(emotes).length - 1));
				content += emotes[ Object.keys(emotes)[check] ];

				client.say(channel, `${content}`);
			},
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}