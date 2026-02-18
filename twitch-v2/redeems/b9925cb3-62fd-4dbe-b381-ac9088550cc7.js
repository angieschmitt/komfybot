// REDEEM: Get KomfyCoins
// USER: KomfyKiwi

const axios = require('axios');

const functionsFile = require('../functions/index');
const functions = functionsFile.content();

const redeem = {
	redeemHandler(redeemData, client) {
		const args2 = ['!coins', 'add', redeemData['user_login'], 160, 'Coin Conversion' ];
		const message2 = `!coins add ${redeemData['user_login']} 160 Coin Conversion`;
		client.commands.global.coins.actions.add.execute(args2, { 'silent': true }, message2, client.channel, client);

		const content = 'Redeem processed!';
		functions.sayHandler(client, content);

		axios.get(client.endpoint + '/redeems/redeem/' + client.userID + '/' + redeemData.id + '/' + redeemData.reward.id)
			.catch(err => console.log(err));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};