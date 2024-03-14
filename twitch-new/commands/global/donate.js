module.exports = {
	name: 'donate',
	help: 'Displays a donate link',
	aliases: {
		'tip': {
			arg: false,
			list: false,
		},
	},
	actions: {
		default: {},
		komfykiwi: {
			say: 'Appreciate what you see and want to donate? Head here: https://streamlabs.com/komfykiwi/tip',
		},
	},
};