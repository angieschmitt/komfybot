module.exports = {
	list: false,
	name: 'event-promo',
	channel: 'komfykiwi',
	help: 'Event Promos',
	aliases: {
		'24h': {
			arg: 'twentyfourhour',
			list: false,
			disabled: true,
		},
		'oneshot': {
			arg: 'oneshot',
			list: false,
			disabled: true,
		},
		'snackwheel': {
			arg: 'snackwheel',
			list: false,
			disabled: true,
		},
		'subtember': {
			arg: 'subtember',
			list: false,
			disabled: true,
		},
		'valentine': {
			arg: 'valentine',
			list: false,
			disabled: true,
		},
		'xmas': {
			arg: 'december',
			list: false,
			disabled: true,
		},
	},
	actions: {
		default: {
			say: 'How did you trigger this?',
		},
		december: {
			say: 'Hey, if you cheer exactly 100 Bits in the Month of December, you can get YOUR NAME ' +
			'on an ornament on the tree behind Kiwi! Limited qty, so get yours while you still can!',
		},
		oneshot: {
			say: 'Interested in playing the one shot with your group? Cheer 200 or more bits, ' +
			'make a donation of $2 or more, or sub today to get it for free!',
		},
		valentine: {
			say: 'Wanna be my valentine and have YOUR NAME on a Heart on the wall behind me? ' +
			'100 Bits or 1$ donation! Also a great gift for your favorite person in Chat as well! :P',
		},
		snackwheel: {
			say: 'Spin spin spin, The Snack Wheel ... OF DOOM! ' +
			'From gummy hotdogs, to sour snacks, to the ol\' BeanBoozle, ' +
			'you can find more info here: ' +
			'https://twitter.com/KomfyKiwi/status/1724098282605985805',
		},
		subtember: {
			say: 'WOOHOO IT\'S SUBtember! This year Twitch is offering 20% - 30% discounts on subs! ' +
			'That also includes gifties and upgrades... if you know someone who would LOVE a sub, nows ' +
			'the time to help them (or you) join the KomfyKrew! I\'ve also created a rule sets and some ' +
			'incentives that allow you all to mess with me while I try to complete my runs! ' +
			'For more info, check out the !incentives command!',
		},
		twentyfourhour: {
			say: 'We\'ve got tons of sub goals and bit redeems, too many to list actually. ' +
			'Here\'s a link to the post on Twitter with all the info: ' +
			'https://twitter.com/KomfyKiwi/status/1723539224043921544',
		},
	},
};