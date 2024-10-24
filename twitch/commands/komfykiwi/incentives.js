module.exports = {
	name: 'incentives',
	channel: 'komfykiwi',
	disabled: true,
	help: 'Incentives explainer! Additional arguments: bingo, keyitem',
	aliases: {
		'subotage': {
			list: false,
			disabled: true,
		},
	},
	actions: {
		default: {
			say: 'During SUBtember SUBotage, I\'m playing games with differnt incentives to allow YOU to mess ' +
			'with me while I stream. Each game has different incentives, so try out the following commands to see ' +
			'what\'s available: !incentives bingo, !incentives keyitem',
		},
		bingo: {
			say: 'BINGO SUBOTAGE: 69 bits: Play with eyes closed for 3 minutes || 100 bits: Add YOUR bingo goal to a free space || ' +
			'1 sub/250 bits: Change existing goal to YOUR idea || 300 bits: Add goal to existing space ' +
			'(more than > one per square) || 420 bits: Uncheck goal and swap it for YOUR goal || 5 subs/1200 bits: ' +
			'Reset the game NOW || 10 subs / 2500 bits: Do the ENTIRE bingo card!',
		},
		keyitem: {
			say: 'KEYITEM SUBOTAGE: 69 Bits: Play while DABBING for 1 Min || 100 Bits: EYES CLOSED for 1 Min || ' +
			'1 Sub / 250 Bits: Rename the Main ASAP || 300 Bits TOSS any one Item stack || 420 Bits: BAN one ' +
			'Item Type || 500 Bits: BAN one Move of Main || 5 Subs / 1200 Bits: KILL Main & Deposit it || ' +
			'10 Subs / 2500 Bits: RESET right here & now! || 20 Subs / 5000 Bits: I do as YOU say for 10 Min',
		},
	},
};