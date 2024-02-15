const axios = require('axios');
const newUrl = 'https://www.kittenangie.com/bots/api/v1/';

module.exports = {
	name: 'race',
	help: 'Outputs info about the current race, with a multitwitch link. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';

				axios.get(newUrl + '/racers/retrieve')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							const runners = JSON.parse(output.response);

							if (runners.length !== 0) {
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
								content = 'Let a mod know to add the runner(s)!';
							}
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
						}
					})
					.catch(function() {
						content = 'Something went wrong, tell @kittenAngie.';
					})
					.finally(function() {
						client.say(channel, content);
					});

				client.say(channel, `${content}`);
			},
		},
		set: {
			help: 'Used to set the runners. !race set <username:required> <username:optional>',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
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

				axios.get(newUrl + '/racers/insert' + racers)
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Set the racers!';
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
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
				error: 'This is a mod only command',
			},
			execute(args, tags, message, channel, client) {

				let content = '';
				axios.get(newUrl + 'racers/reset')
					.then(function(response) {
						const output = response.data;
						if (output.status === 'success') {
							content = 'Reset the racers.';
						}
						else {
							content = 'Something went wrong, tell @kittenAngie.';
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