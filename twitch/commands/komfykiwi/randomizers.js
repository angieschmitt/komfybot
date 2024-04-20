module.exports = {
	name: 'randomizers',
	list: false,
	channel: 'komfykiwi',
	help: 'Randomizer explainer',
	aliases: {
		'bingo': {
			arg: 'bingo',
		},
		'keyitem': {
			arg: 'keyitem',
		},
	},
	actions: {
		default: {},
		bingo: {
			say: 'In this Randomizer: Pokemon, movesets, and field items are all randomized. ' +
			'A random Bingo board, filled with various \'Goals\', is assembled and only revealed once the run has started. ' +
			'Players must get 5 Goals in a row, column or diagonal to form a set. ' +
			'In CINCO Bingo, the goal is to have 5 sets as fast as possible & click the \'Done Button\'. ' +
			'We start with the bike & allow riding it indoors for convenience.  ' +
			'For TM ## (xyz) Goals, EITHER the Number OR the Move counts, for ease of randomizing. ',
		},
		keyitem: {
			say: 'In this Randomizer, Pokemon and their movesets are all randomized. ' +
			'On top of that, all Key Items and badges have been randomized as well. ' +
			'There is logic baked into it, guaranteeing a game that is still solvable every time. ' +
			'The goal is to collect reach 16 badges, and beat Red before everyone else.',
		},
	},
};