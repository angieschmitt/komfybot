const axios = require('axios');
const dataFile = require('../../data/index');
const data = dataFile.content();

axios.defaults.headers.common['Authorization'] = data.settings.apiKey;

module.exports = {
	name: 'race',
	channel: ['komfykiwi'],
	help: 'Outputs info about the current race, with a multitwitch link. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				axios.get(data.settings.finalUrl + 'racers/retrieve')
					.then(function(response) {
						const resData = response.data;
						if (resData.status === 'success') {
							const runners = JSON.parse(resData.response);
							if (runners.length !== undefined && runners.length !== 0) {
								let text = '';
								let nameList = '';
								let url = '';

								if (runners.length > 1) {
									text = 'all of us';
									for (let index = 0; index < runners.length; index++) {
										if (index === (runners.length - 1)) {
											url += runners[index].replace('@', '');
											nameList = nameList.substring(0, nameList.length - 2);
											nameList += ` and ${runners[index]}`;
										}
										else {
											url += `${runners[index].replace('@', '')}/`;
											nameList += `${runners[index]}, `;
										}
									}
								}
								else {
									text = 'both of us';
									nameList = `${runners[0]}`;
									url += runners[0].replace('@', '');
								}

								content = 'We\'re racing ' + nameList + ' in a !keyitem randomizer! ';
								content += 'If you wanna tune in to ' + text + ' at the same time, feel free to use: ';
								content += 'https://www.multitwitch.tv/komfykiwi/' + url;
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
				error: 'don\'t forgot the user you are racing!',
			},
			execute(args, tags, message, channel, client) {

				let content, racers = '';
				for (let index = 2; index < args.length; index++) {
					racers += '/' + args[index].replace('@', '');
				}

				axios.get(data.settings.finalUrl + 'racers/insert' + racers)
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

				let content = '';
				axios.get(data.settings.finalUrl + 'racers/reset')
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