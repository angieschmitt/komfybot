// REDEEM: Get KomfyCoins
// USER: KomfyKiwi

const axios = require('axios');

const redeem = {
	redeemHandler(redeemData, client) {
		const args2 = ['!coins', 'add', redeemData['user_login'], 160, 'Coin Conversion' ];
		const message2 = `!coins add ${redeemData['user_login']} 160 Coin Conversion`;
		client.commands.global.coins.actions.add.execute(args2, { 'silent': true }, message2, client.channel, client);

		client.say(client.channel, 'Redeem processed!').catch(() => {
			setTimeout(() => {
				client.say(client.channel, 'Redeem processed!');
			}, 2500);
		});

		axios.get(client.endpoint + '/redeems/redeem/' + client.userID + '/' + redeemData.id + '/' + redeemData.reward.id)
			.catch(err => console.log(err));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};