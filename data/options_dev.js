const axios = require('axios');

const options = {
	baseUrl: 'https://www.kittenangie.com/bots/api_new/',
	identity: {
		username: 'komfybot',
		password: axios.get('https://www.kittenangie.com/bots/api_new/retrieve/key?id=komfybot_token')
			.then(function(response) { return response.data.key; }),
	},
	channels: [
		// 'komfykiwi',
		'kittenangie',
		// 'alazysun',
		// 'misterdoctorxman',
	],
	options: {
		// debug: true,
	},
	connection: {
		reconnect: true,
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return options;
	},
};