const axios = require('axios');

module.exports = {
	async function(client, userID) {
		axios.get(client.endpoint + 'live/update/' + userID + '/force')
			.then(function(response) {
				const responseData = response.data;
				if (responseData.status === 'success') {
					const userData = responseData.response;
					client['isLive'] = (userData.isLive === '0' ? false : true);
					client['streamData'] = userData.streamData;

					if (Object.keys(client.streamData).length > 0) {
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