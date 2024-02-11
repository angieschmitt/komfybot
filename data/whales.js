const whales = {
	'text': [
		'whale',
		'whales',
		'w h a l e',
		'w h a l e s',
		'w hales',
		'wh ales',
		'wha les',
		'whal es',
		'wal',
		'baleine',
		'samir',
	],
	'emoji': [
		'🐋',
		'🐳',
	],
	'morse' : [
		'.-- .- .-..',
		'.-- .... .- .-.. .',
		'-... .- .-.. . .. -. .',
	],
	'binary': [
		'01010111 01100001 01101100',
		'01010111 01101000 01100001 01101100 01100101',
		'01000010 01100001 01101100 01100101 01101001 01101110 01100101',
	],
};

// mymodule.js
module.exports = {
	content: function() {
		return whales;
	},
};