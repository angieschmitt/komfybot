const words = {
	'kittenangie': {
		'0': {
			'comfy': 'Hey <username>, you misspelled that.',
		},
		'90928645': {
			'test': 'Hey. <username>. Stop it.',
			'whale' : 'Hey <username>, you\'re a dingus.',
			'🐋' : 'Hey <username>, 🚫🐋‼️',
		},
	},
	'komfykiwi': {
		'0': {
			'comfy': 'Hey <username>, you misspelled that.',
		},
		'16192204': {
			'whale' : 'Hey <username>, you\'re a dingus.',
			'whales' : 'Hey <username>, you\'re a dingus.',
			'w h a l e' : 'Hey <username>, you\'re a dingus.',
			'w h a l e s' : 'Hey <username>, you\'re a dingus.',
			'w hales' : 'Hey <username>, you\'re a dingus.',
			'wh ales' : 'Hey <username>, you\'re a dingus.',
			'wha les' : 'Hey <username>, you\'re a dingus.',
			'whal es' : 'Hey <username>, you\'re a dingus.',
			'wal' : 'Hey <username>, you\'re a dingus.',
			'baleine' : 'Hey <username>, you\'re a dingus.',
			'samir' : 'Hey <username>, you\'re a dingus.',
			'🐋' : '<username>, 🚫🐋‼️',
			'🐳' : '<username>, 🚫🐋‼️',
			'.-- .- .-..' : '<username>, -.-- --- ..- .----. .-. . / .- / -.. .. -. --. ..- ...',
			'.-- .... .- .-.. .' : '<username>, -.-- --- ..- .----. .-. . / .- / -.. .. -. --. ..- ...',
			'-... .- .-.. . .. -. .' : '<username>, -.-- --- ..- .----. .-. . / .- / -.. .. -. --. ..- ...',
			'01010111 01100001 01101100' : '<username>, 01111001 01101111 01110101 00100111 01110010 01100101 00100000 01100001 00100000 01100100 01101001 01101110 01100111 01110101 01110011',
			'01010111 01101000 01100001 01101100 01100101' : '<username>, 01111001 01101111 01110101 00100111 01110010 01100101 00100000 01100001 00100000 01100100 01101001 01101110 01100111 01110101 01110011',
			'01000010 01100001 01101100 01100101 01101001 01101110 01100101' : '<username>, 01111001 01101111 01110101 00100111 01110010 01100101 00100000 01100001 00100000 01100100 01101001 01101110 01100111 01110101 01110011',
		},
	},
};

module.exports = {
	content: function() {
		return words;
	},
};