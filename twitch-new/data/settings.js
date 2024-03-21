const axios = require('axios');

const settings = {
	baseUrl: 'https://www.kittenangie.com/bots/api_new/',
	newUrl: 'https://www.kittenangie.com/bots/api/v1/',
	live : {
		channels: [
			'komfybot',
			'komfykiwi',
			// 'kittenangie',
			// 'alazysun',
		],
		options: {
			// debug: true,
		},
		identity: {
			username: 'komfybot',
			password: axios.get('https://www.kittenangie.com/bots/api_new/retrieve/key?id=komfybot_token')
				.then(function(response) { return response.data.key; }),
		},
	},
	dev: {
		channels: [
			'komfybot',
			// 'komfykiwi',
			'kittenangie',
			// 'alazysun',
			// 'mrdrxman',
			// 'themacogo95',
			// 'kiva_',
		],
		options: {
			// debug: true,
		},
		identity: {
			username: 'komfybot',
			password: axios.get('https://www.kittenangie.com/bots/api_new/retrieve/key?id=komfybot_token')
				.then(function(response) { return response.data.key; }),
		},
	},
	connection: {
		reconnect: true,
	},
};

// mymodule.js
module.exports = {
	content: function() {
		return settings;
	},
};