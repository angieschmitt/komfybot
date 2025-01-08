// const axios = require('axios');
// const dataFile = require('../../data/index');
// const data = dataFile.content();

// axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

// module.exports = {
// 	name: 'quote',
// 	channel: ['komfykiwi'],
// 	help: 'Pull a quote from our growing database of silliness!',
// 	actions: {
// 		default: {
// 			execute(args, tags, message, channel, client) {
// 				let id = false;
// 				let content = '';
// 				axios.get(data.settings.finalUrl + 'quote/retrieve')
// 					.then(function(response) {
// 						const resData = response.data;
// 						id = resData.id;
// 						if (resData.status === 'success') {
// 							content = resData.response;
// 						}
// 						else if (resData.status === 'failure') {
// 							if (resData.err_msg === 'missing_authorization') {
// 								content = 'Authorization issue. Tell @kittenAngie.';
// 							}
// 							else {
// 								content = 'Something went wrong, tell @kittenAngie.';
// 							}
// 						}
// 						else {
// 							content = 'Something went wrong, tell @kittenAngie.';
// 						}
// 					})
// 					.catch(function() {
// 						content = 'Something went wrong, tell @kittenAngie.';
// 					})
// 					.finally(function() {
// 						if (id === '3') {
// 							client.say(channel, content);
// 						}
// 						client.say(channel, content);
// 					});
// 			},
// 		},
// 	},
// };