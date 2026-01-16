const axios = require('axios');

module.exports = {
	async function(userID, globals) {
		console.log(globals['endpoint'] + 'live/retrieve/' + userID);
		return axios.get(globals['endpoint'] + 'live/retrieve/' + userID)
			.then(function(response) {
				const responseData = response.data;
				if (responseData.status === 'success') {
					return true;
				}
				return false;
			})
			.catch(err => console.log(err));
	},
};