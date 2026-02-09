const axios = require('axios');

module.exports = {
	async function(client, userID) {
		axios.get(client.endpoint + 'live/retrieve/' + userID)
			.then(function(response) {
				const responseData = response.data;
				if (responseData.status === 'success') {
					const userData = responseData.response[ client['twitchUUID'] ];
					client['isLive'] = (userData.isLive === '0' ? false : true);
					client['streamData'] = userData.streamData;
				}
			})
			.catch(err => console.log(err));
	},
};