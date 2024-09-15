module.exports = {
	list: false,
	name: 'brb',
	help: 'Streamer be right back message',
	actions: {
		default: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command!',
			},
			say: 'I\'ll be right back!',
		},
		komfykiwi: {
			perms: {
				levels: ['streamer'],
				error: 'This is a streamer only command!',
			},
			say: 'Kiwi is taking a quick break & YOU should do the same! Take care of yourself! ' +
			'If you\'d rather hangout and interact with the stream - here is how: ' +
			'Words On Stream - submit answer(s) in the twitch chat, and don\'t forget you get ONE correct word per "lock"! || ' +
			'Smash 64 - use the "Pick A Fighter / Stage" redeem BEFORE the game, then bet on ANY fighter in the prediction! If your fighter wins, you win channel points & KomfyKoins! || ' +
			'Participation in BRB activities is always rewarded with KomfyKoins! ',
		},
	},
};