module.exports = {
	name: 'holiday',
	channel: 'komfykiwi',
	list: false,
	disabled: false,
	help: 'Command to hand out holiday stuff',
	aliases: {
	},
	actions: {
		default: {
			say: 'Holiday commands!',
		},
		hats: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const hats = [
					'Santa Hat',
					'Mittens',
					'Laurel Wreath Crown',
					'Red Fez',
				];

				// eslint-disable-next-line no-unused-vars
				Object.entries(hats).forEach(([key, hat]) => {
					const args2 = ['!hat', 'give', args[2], hat ];
					const message2 = `!hat give ${args[2]} ${hat}`;
					tags['silent'] = true;
					client.commands.komfykiwi.hattington.actions.give.execute(args2, tags, message2, channel, client);
				});

				client.say(channel, `Handed out the holiday hats to ${args[2]}!`);
			},
		},
		snacks: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const snacks = [
					'Snacks: Kiwi Cocoa',
					'Snacks: Star Cookie',
					'Snacks: Jelly Bean',
				];

				// eslint-disable-next-line no-unused-vars
				Object.entries(snacks).forEach(([key, snack]) => {
					const args2 = ['!hat', 'give', args[2], snack ];
					const message2 = `!hat give ${args[2]} ${snack}`;
					tags['silent'] = true;
					client.commands.komfykiwi.snacks.actions.give.execute(args2, tags, message2, channel, client);
				});

				client.say(channel, `Handed out the holiday snacks to ${args[2]}!`);
			},
		},
	},
};