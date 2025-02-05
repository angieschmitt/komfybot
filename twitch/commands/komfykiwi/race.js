const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'race',
	help: 'Outputs info about the current race, with a multitwitch link. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {

				const channelName = channel.replace('#', '');

				let content = '';

				axios.get(data.settings.finalUrl + 'racers/retrieve/' + channelName)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const length = Object.keys(resData.response).length;
							if (length !== undefined && length !== 0) {
								let text = '';
								let nameList = '';
								let url = '';

								if (length > 1) {
									text = 'all of us';
									// eslint-disable-next-line
									Object.entries(resData.response).forEach(([index, value]) => {
										if (parseInt(index) === (length - 1)) {
											url += resData.response[index].replace('@', '');
											nameList = nameList.substring(0, nameList.length - 2);
											nameList += ` and ${resData.response[index]}`;
										}
										else {
											url += `${resData.response[index].replace('@', '')}/`;
											nameList += `${resData.response[index]}, `;
										}
									});
								}
								else {
									text = 'both of us';
									nameList = `${resData.response[0]}`;
									url += resData.response[0].replace('@', '');
								}

								content = 'We\'re currently racing ' + nameList + '! ';
								content += 'If you wanna tune in to ' + text + ' at the same time, feel free to use: ';
								content += 'https://www.multitwitch.tv/' + channelName + '/' + url;
							}
							else {
								content = 'Seems like we aren\'t racing anyone yet!';
							}
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie 1.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		set: {
			help: 'Used to set the runners. !race set <username:required> <username:optional>',
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			args: {
				1: [ 'r' ],
				2: [ 'r' ],
				error: 'don\'t forgot the user you are racing!',
			},
			execute(args, tags, message, channel, client) {

				// Get channel and userID
				const channelName = channel.replace('#', '');

				let content = '';

				// Setup JSON to pass through
				const raceData = { 'ident_type':'twitch_username', 'ident':channelName, 'racers':{} };
				let iter = 0;
				for (let index = 2; index < args.length; index++) {
					raceData['racers'][iter] = args[index].replace('@', '');
					iter++;
				}

				axios.get(data.settings.finalUrl + 'racers/insert/json/' + encodeURIComponent(JSON.stringify(raceData)))
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = 'Set the racers!';
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
		reset: {
			help: 'Used to set the runners. !race set <username:required> <username:optional>',
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const channelName = channel.replace('#', '');

				let content = '';
				axios.get(data.settings.finalUrl + 'racers/reset/' + channelName)
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							content = 'Reset the racers.';
						}
						else if (resData.status === 'failure') {
							if (resData.err_msg === 'missing_authorization') {
								content = 'Authorization issue. Tell @kittenAngie.';
							}
							else {
								content = 'Something went wrong, tell @kittenAngie 3.';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie 2.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});
			},
		},
	},
};