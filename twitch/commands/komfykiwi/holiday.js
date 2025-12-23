module.exports = {
	name: 'holiday',
	channel: ['komfykiwi', 'komfybot'],
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

				const content = `Handed out the holiday hats to ${args[2]}! Enjoy your Santa Hat, Mittens, Wreath Crown, and Red Fez (cause Fez's are cool)!`;
				if ('silent' in tags) {
					if (tags.silent !== true) {
						client.say(channel, `${content}`);
					}
				}
				else {
					client.say(channel, `${content}`);
				}
			},
		},
		snacks: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const snacks = [
					'Kiwi Cocoa',
					'Kiwi Cocoa',
					'Star Cookie',
					'Star Cookie',
					'Jelly Bean',
					'Jelly Bean',
				];

				// eslint-disable-next-line no-unused-vars
				Object.entries(snacks).forEach(([key, snack]) => {
					const args2 = ['!snack', 'freebie', args[2], snack ];
					const message2 = `!snack freebie ${args[2]} ${snack}`;
					tags['silent'] = true;
					client.commands.komfykiwi.snacks.actions.freebie.execute(args2, tags, message2, channel, client);
				});

				const content = `Handed out the holiday snacks to ${args[2]}! Make sure to give Hattington some Kiwi Cocoa, Star Cookies, or Jelly Beans!`;
				if ('silent' in tags) {
					if (tags.silent !== true) {
						client.say(channel, `${content}`);
					}
				}
				else {
					client.say(channel, `${content}`);
				}
			},
		},
		gifts: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {
				tags['silent'] = true;

				const args2 = ['!holiday', 'snacks', args[2] ];
				const message2 = `!holiday snacks ${args[2]}`;
				client.commands.komfykiwi.holiday.actions.snacks.execute(args2, tags, message2, channel, client);

				const args3 = ['!holiday', 'hats', args[2] ];
				const message3 = `!holiday hats ${args[2]}`;
				client.commands.komfykiwi.holiday.actions.hats.execute(args3, tags, message3, channel, client);

				let content = `Handed out the holiday gifts to ${args[2]}! `;
				content += 'Make sure to share your Kiwi Cocoa, Star Cookies, or Jelly Beans! ';
				content += 'Also check out the Santa Hat, Mittens, Wreath Crown, and Red Fez (cause Fez\'s are cool)!';
				client.say(channel, `${content}`);
			},
		},
	},
};