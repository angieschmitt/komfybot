module.exports = {
	list: false,
	channel: ['1'],
	name: 'ascii',
	help: 'An assortment of ascii emojis',
	aliases: {
		'angy': {
			arg: 'angry',
			list: true,
		},
		'angry': {
			arg: 'angry',
			list: false,
		},
		'cats': {
			arg: 'cat',
			list: false,
		},
		'shrug': {
			arg: 'shrug',
			list: false,
		},
		'sigh': {
			arg: 'sigh',
			list: false,
		},
	},
	actions: {
		default: {
			say: ['Angry, Shrug, Cats, and more...'],
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

				client.say(channel, content).catch(() => {
					setTimeout(() => {
						client.say(channel, content);
					}, 2500);
				});
			},
		},
		cat: {
			execute(args, tags, message, channel, client) {
				let content = '';
				let check = 0;
				const emotes = {
					'1' : 'ᓚᘏᗢ',
					'2' : '≽^•⩊•^≼',
					'3' : '₍^. .^₎⟆',
					'4' : '(•˕ •マ.ᐟ',
					'5' : 'ฅ^._.^ฅ',
				};

				check = randomIntFromInterval(0, (Object.keys(emotes).length - 1));
				content += emotes[ Object.keys(emotes)[check] ];

				client.say(channel, content).catch(() => {
					setTimeout(() => {
						client.say(channel, content);
					}, 2500);
				});
			},
		},
		shrug: {
			execute(args, tags, message, channel, client) {
				let content = '';
				let check = 0;
				const emotes = {
					'1' : '¯\\_(ツ)_/¯',
				};

				check = randomIntFromInterval(0, (Object.keys(emotes).length - 1));
				content += emotes[ Object.keys(emotes)[check] ];

				client.say(channel, content).catch(() => {
					setTimeout(() => {
						client.say(channel, content);
					}, 2500);
				});
			},
		},
		sigh: {
			execute(args, tags, message, channel, client) {
				let content = '';
				let check = 0;
				const emotes = {
					'1' : '(づ ¬`﹏´¬ )づ',
					'2' : '(づ ᴗ _ᴗ)づ',
					'3' : '¯\\_( ᴗ _ᴗ)_/¯',
				};

				check = randomIntFromInterval(0, (Object.keys(emotes).length - 1));
				content += emotes[ Object.keys(emotes)[check] ];

				client.say(channel, content).catch(() => {
					setTimeout(() => {
						client.say(channel, content);
					}, 2500);
				});
			},
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}