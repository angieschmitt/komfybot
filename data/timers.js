const timers = {
	'discord': {
		'channel': 'komfykiwi',
		'timer': 30,
		'message': 'Come hang with the KomfyKrew on Discord: https://discord.gg/8T44G4mUFu',
	},
	'socials': {
		'channel': 'komfykiwi',
		'timer': 120,
		'message': 'Yo, wanna see more komfyness? I would highly appreciate you checking out all my socials and maybe dropping a follow! There is an easy overview list right here: https://komfykiwi.com/socials',
	},
	'appreciate': {
		'channel': 'komfykiwi',
		'timer': 200,
		'message': 'Hey, just letting YOU know, that you matter & that you’re appreciated! You deserve to have great things, and it is totally okay to feel exhausted sometimes. You ARE beautiful, and I am SOO happy that you’re here - thank you! Also, ya know, nice butt. ♡',
	},
	'tipsandbits': {
		'channel': 'komfykiwi',
		'timer': 240,
		'message': 'Don’t mind me, just humbly reminding you all that Kiwi is trying to make streaming her full time gig! So if you can swing it, she’d highly appreciate any form of support, be it a Twitch Subscription, a Tip or some Bits. No contribution is ever required or expected, but always comes with her never ending, deepest gratitude! Why not gift a Sub to a fren? :3 Or use your Amazon Prime? All the funds go to improving the stream, as well as bills. Remember to always spend responsibly! THANK YOU! ♡',
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return timers;
	},
};