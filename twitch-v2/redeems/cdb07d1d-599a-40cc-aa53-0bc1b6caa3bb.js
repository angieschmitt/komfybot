// REDEEM: Bird Magic
// USER: kittenAngie

const redeem = {
	redeemHandler(redeemData, client) {
		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : redeemData.id, 'content' : redeemData.user_input, 'target': 'bird-magic:' + client.userID }, 'source': 'komfybot' }));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};