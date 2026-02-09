// REDEEM: Chaos mode
// USER: kittenAngie

const path = require('path');

const redeem = {
	redeemHandler(redeemData, client) {

		// Build message...
		let message = 'Chaos mode word list: ';
		Object.entries(client.data.chaosWords).forEach(([idx]) => {
			message += client.data.chaosWords[idx] + ', ';
		});

		// Now say the message in kiwi's channel
		client.say(client.channel, message.substring(0, message.length - 2)).catch(() => {
			setTimeout(() => {
				client.say(client.channel, message.substring(0, message.length - 2));
			}, 2500);
		});

		// Set chaosMode state...
		client.redeems.states.chaosMode = true;
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : path.basename(__filename, '.js'), 'redemptionID': redeemData.id, 'content' : redeemData.user_input, 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));

		// Start timer to turn it off...
		setTimeout(function() {
			client.redeems.states.chaosMode = false;
		}, 30000);
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};