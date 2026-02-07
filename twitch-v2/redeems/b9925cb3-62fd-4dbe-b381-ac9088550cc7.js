// REDEEM: Get KomfyCoins
// USER: KomfyKiwi

const axios = require('axios');

const redeem = {
	redeemHandler(redeemData, client) {
		const args2 = ['!coins', 'add', redeemData['user_login'], 160, 'Coin Conversion' ];
		const message2 = `!coins add ${redeemData['user_login']} 160 Coin Conversion`;
		client.commands.global.coins.actions.add.execute(args2, { 'silent': true }, message2, client.channel, client);

		axios.get('https://api.komfybot.com/v2/endpoint/redeems/redeem/' + client.userID + '/' + redeemData.id + '/' + redeemData.reward.id)
			.catch(err => console.log(err));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};