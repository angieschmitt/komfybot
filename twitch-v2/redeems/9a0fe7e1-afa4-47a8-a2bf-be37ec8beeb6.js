// REDEEM: Chaos mode
// USER: kittenAngie

const redeem = {
	redeemHandler(redeemData, client) {

		// Build message...
		let message = 'Chaos mode word list: ';
		Object.entries(client.data.chaosWords).forEach(([idx]) => {
			message += client.data.chaosWords[idx] + ', ';
		});

		// Now say the message in kiwi's channel
		client.say(client.channel, message.substring(0, message.length - 2));

		// Set chaosMode state...
		client.redeems.states.chaosMode = true;
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : redeemData['id'], 'content' : redeemData['userInput'], 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));

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