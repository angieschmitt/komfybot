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

					if (userData.streamData.started_at !== undefined) {
						const dateLive = new Date(userData.streamData.started_at);
						const dateNow = new Date();
						const minsLive = Math.floor(Math.floor((dateNow - (dateLive)) / 1000) / 60);

						// Set the timerOffset
						client.timerOffset = minsLive;
					}
				}
			})
			.catch(err => console.log(err));
	},
};