const axios = require('axios');

// REDEEM: Chaos mode

const redeem = {
	redeemHandler(redeemData, client) {

		// id				0
		// userID			"1"
		// redeemID			"9a0fe7e1-afa4-47a8-a2bf-be37ec8beeb6"
		// redemptionID		"ce2c9690-9bd4-4fa2-9344-5b17c8a35ca3"
		// userInput		"adwda"
		// lastUpdated		"2026-01-30 15:16:04"

		client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : redeemData['id'], 'content' : redeemData['userInput'], 'target': 'popcat:' + client.userID }, 'source': 'komfybot' }));
	},
};

module.exports = {
	content: function() {
		return redeem;
	},
};