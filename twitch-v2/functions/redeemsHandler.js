module.exports = {
	function(redeemID) {
		const redeemFile = require('../redeems/' + redeemID);
		const redeem = redeemFile.content();
		return redeem;
	},
};