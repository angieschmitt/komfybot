// REDEEM: Test
// USER: kittenAngie

const redeem = {
	redeemHandler(redeemData, client) {
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : redeemData.id, 'content' : redeemData.user_input, 'target': 'test:' + client.userID }, 'source': 'komfybot' }));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};