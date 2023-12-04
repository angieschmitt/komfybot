module.exports = {
	name: 'race',
	description: 'Key Item Race explainer',
	help: 'Explainer about Key Item Rando races. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				console.log(client.extras.race.length);
				if (client.extras.race.length !== 0) {
					let text = '';
					let nameList = '';
					let url = '';

					if (client.extras.race.length > 1) {
						text = 'all of us';
						for (let index = 0; index < client.extras.race.length; index++) {
							if (index === (client.extras.race.length - 1)) {
								url += client.extras.race[index].replace('@', '');
								nameList = nameList.substring(0, nameList.length - 2);
								nameList += ` and ${client.extras.race[index]}`;
							}
							else {
								url += `${client.extras.race[index].replace('@', '')}/`;
								nameList += `${client.extras.race[index]}, `;
							}
						}
					}
					else {
						text = 'both of us';
						nameList = `${client.extras.race[0]}`;
						url += client.extras.race[0].replace('@', '');
					}

					content = 'We\'re racing ' + nameList + ' in a !keyitem randomizer! ';
					content += 'If you wanna tune in to ' + text + ' at the same time, feel free to use: ';
					content += 'https://www.multitwitch.tv/komfykiwi/' + url;
				}
				else {
					content = 'Let a mod know to add the runner(s)!';
				}
				client.say(channel, `${content}`);
			},
		},
		set: {
			help: 'Used to set the runner. !race set <username:required>',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the user you are racing!',
			},
			execute(args, tags, message, channel, client) {
				client.extras.race = [];
				for (let index = 2; index < args.length; index++) {
					client.extras.race.push(args[index]);
				}
			},
		},
	},
};