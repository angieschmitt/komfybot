const links = {
	'kiwi' : 'https://clips.twitch.tv/AbrasiveIncredulousFishMVGame-Zs5rxq2JhgjKgOat',
	'lycan' : 'https://clips.twitch.tv/PoliteBrainyInternVoteYea-eVSsDvIPLWCh5MKR',
	'mrdrxman' : 'https://clips.twitch.tv/DrabIncredulousChoughBibleThump-_q416OBjlz17Tdzn',
};

module.exports = {
	name: 'poop',
	channel: 'komfykiwi',
	help: '💩💩💩💩💩',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				let check = 0;
				// If assigned, use it
				if (args[1]) {
					if (!isNaN(parseInt(args[1]))) {
						check = args[1];
					}
					else {
						const keys = Object.keys(links);
						check = keys.indexOf(args[1]);
					}
				}
				else {
					check = randomIntFromInterval(0, (Object.keys(links).length - 1));
				}

				content += links[ Object.keys(links)[check] ];

				client.say(channel, `${content}`);
			},
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}