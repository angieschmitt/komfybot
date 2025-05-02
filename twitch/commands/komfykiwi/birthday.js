module.exports = {
	name: 'birthday',
	channel: 'komfykiwi',
	list: false,
	disabled: false,
	help: 'Command to hand out birthday hats',
	aliases: {
		'bdayhats': {
			arg: 'hats',
			list: false,
		},
		'raffle': {
			arg: 'raffle',
			list: false,
		},
	},
	actions: {
		default: {
			say: 'Birthday commands!',
		},
		hats: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const hats = [
					'Pie Hat',
					'Cult of the Hattyboi',
					'Monster Race Hat',
					'MTG Hat',
					// 'Santa Hat',
					'Party Hat - Blue',
					'Party Hat - Green',
					'Party Hat - Red',
				];

				// eslint-disable-next-line no-unused-vars
				Object.entries(hats).forEach(([key, hat]) => {
					const args2 = ['!hat', 'give', args[2], hat ];
					const message2 = `!hat give ${args[2]} ${hat}`;
					tags['silent'] = true;
					client.commands.komfykiwi.hattington.actions.give.execute(args2, tags, message2, channel, client);
				});

				client.say(channel, `Handed out the birthday hats to ${args[2]}! Enjoy your Pie Hat, Cult of the Hattyboi Hat, Monster Race Hat, MTG Hat and all the Party Hats!`);
			},
		},
		raffle: {
			perms: {
				levels: ['mod'],
				error: 'this command is for mods only.',
			},
			execute(args, tags, message, channel, client) {

				const games = {
					'Espresso Tycoon' : 'https://store.steampowered.com/app/1543280/Espresso_Tycoon/',
					'Frostpunk' : 'https://store.steampowered.com/app/323190/Frostpunk/',
					'Mad Games Tycoon 2': 'https://store.steampowered.com/app/1342330/Mad_Games_Tycoon_2/',
					'PlateUp!' : 'https://store.steampowered.com/app/1599600/PlateUp/',
					'Recipe for Disaster' : 'https://store.steampowered.com/app/1492360/Recipe_for_Disaster/',
					// 'Breathedge' : 'https://store.steampowered.com/app/738520/Breathedge/',
					// 'Cosmic Osmo and the Worlds Beyond the Mackerel' : 'https://store.steampowered.com/app/63620/Cosmic_Osmo_and_the_Worlds_Beyond_the_Mackerel/',
					// 'Buggos' : 'https://store.steampowered.com/app/789660/Buggos/',
					// 'The Manhole: Masterpiece Edition' : 'https://store.steampowered.com/app/63630/The_Manhole_Masterpiece_Edition/',
					// 'Astro Colony' : 'https://store.steampowered.com/app/1614550/Astro_Colony/',
					// 'Mob Factory' : 'https://store.steampowered.com/app/2182630/Mob_Factory/',
					// 'Spelunx and the Caves of Mr. Seudo' : 'https://store.steampowered.com/app/63640/Spelunx_and_the_Caves_of_Mr_Seudo/',
				};

				const selection = randomProperty(games);
				let content = `We're going to be raffling off a copy of ${selection}! We're using the !guess command to enter, so do !guess ticket to enter.`;
				content += `For info on the game, check out: ${games[selection]}`;

				client.say(channel, content);
			},
		},
	},
};

const randomProperty = function(obj) {
	const keys = Object.keys(obj);
	return keys[ keys.length * Math.random() << 0];
};