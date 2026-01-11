const axios = require('axios');

module.exports = {
	async function(globals) {
		try {
			const response = await axios.get(globals['endpoint'] + 'token/retrieve/all');
			const json = response.data;

			if (json !== undefined) {
				return json.response;
			}
		}
		catch (error) {
			// console.log(error);
		}
	},
};