// REDEEM: Bird Magic
// USER: komfykiwi

const path = require('path');

const redeem = {
	redeemHandler(redeemData, client) {
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : path.basename(__filename, '.js'), 'redemptionID': redeemData.id, 'content' : redeemData.user_input, 'target': 'bird-magic:' + client.userID }, 'source': 'komfybot' }));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};