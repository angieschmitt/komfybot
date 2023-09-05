module.exports = {
	name: 'race',
	description: 'Key Item Race explainer',
	help: 'Explainer about Key Item Rando races. Additional arguments: set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				if (client.extras.race !== '') {
					content = 'We\'re racing ' + client.extras.race + ' in a !keyitem randomizer! ';
					content += 'If you wanna tune in to both of us at the same time, feel free to use: ';
					content += 'https://www.multitwitch.tv/komfykiwi/' + client.extras.race.replace('@', '');
				}
				else {
					content = 'Let a mod know to add the runner!';
				}
				client.say(channel, `${content}`);
			},
		},
		set: {
			help: 'Used to set the runner. !race set <username:required>.',
			perms: {
				levels: ['mod'],
				error: 'This is a mod only command',
			},
			args: {
				1: [ 'r' ],
				error: 'don\'t forgot the user you are racing!',
			},
			execute(args, tags, message, channel, client) {
				client.extras.race = args[2];
			},
		},
	},
};