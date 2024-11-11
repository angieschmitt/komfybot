const timers = {
	'komfykiwi' : {
		'checkin': {
			'timer': 15,
			'message': 'Don\'t forget to !checkin, !chicken, or !shrekin!',
		},
		'discord': {
			'timer': 30,
			'message': 'Come hang with the KomfyKrew on Discord: https://discord.gg/8T44G4mUFu',
		},
		'pronouns': {
			'timer': 60,
			'message': 'If you want to set your pronouns in the browser twitch chat for everyone to see you can do so here: https://pronouns.alejo.io/ - to set your own you just need to go to that website. To see other\'s, you\'ll need to install the extension. Thank you!',
		},
		'socials': {
			'timer': 120,
			'message': 'Yo, wanna see more komfyness? I would highly appreciate you checking out all my socials and maybe dropping a follow! There is an easy overview list right here: https://komfykiwi.com/socials',
		},
		'appreciate': {
			'timer': 200,
			'message': 'Hey, just letting YOU know, that you matter & that you’re appreciated! You deserve to have great things, and it is totally okay to feel exhausted sometimes. You ARE beautiful, and I am SOO happy that you’re here - thank you! Also, ya know, nice butt. ♡',
		},
		'tipsandbits': {
			'timer': 260,
			'message': 'Don’t mind me, just humbly reminding you all that Kiwi is trying to make streaming her full time gig! So if you can swing it, she’d highly appreciate any form of support, be it a Twitch Subscription, a Tip or some Bits. No contribution is ever required or expected, but always comes with her never ending, deepest gratitude! Why not gift a Sub to a fren? :3 Or use your Amazon Prime? All the funds go to improving the stream, as well as bills. Remember to always spend responsibly! THANK YOU! ♡',
		},
	},
	'kittenangie': {
		'discord': {
			'timer': 30,
			'message': 'Come hang with the KomfyKrew on Discord: https://discord.gg/8T44G4mUFu',
		},
		'merch':{
			'timer': 120,
			'message': 'Looking for sweet kittenAngie swag? Check out https://streamlabs.com/kittenangie/merch !',
		},
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return timers;
	},
};