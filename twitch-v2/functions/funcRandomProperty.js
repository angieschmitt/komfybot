module.exports = {
	function(obj) {
		const values = Object.values(obj);
		const random = values[Math.floor(Math.random() * values.length)];
		return random;
	},
};