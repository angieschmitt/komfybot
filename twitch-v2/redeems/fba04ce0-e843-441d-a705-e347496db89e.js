// REDEEM: Chaos mode
// USER: KomfyKiwi

const path = require('path');

const functionsFile = require('../functions/index');
const functions = functionsFile.content();

const redeem = {
	redeemHandler(redeemData, client) {

		// Build message...
		let content = 'Chaos mode word list: ';
		Object.entries(client.data.chaosMode).forEach(([data]) => { // eslint-disable-line no-unused-vars
			content += data + ', ';
		});
		content = content.substring(0, content.length - 2);

		// Now say the message in kiwi's channel
		functions.sayHandler(client, content);

		// Set chaosMode state...
		client.redeems.states.chaosMode = true;
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : path.basename(__filename, '.js'), 'redemptionID': redeemData.id, 'content' : redeemData.user_input, 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));

		// Start timer to turn it off...
		client.timeouts.make(
			'chaosMode',
			() => {
				client.redeems.states.chaosMode = false;
				client.timeouts.clear('chaosMode');
			},
			90000,
		);
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};