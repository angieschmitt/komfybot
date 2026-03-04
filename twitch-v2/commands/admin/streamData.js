const axios = require('axios');

const functionsFile = require('../../functions/index');
const functions = functionsFile.content();

module.exports = {
	list: false,
	name: 'check',
	help: 'An assortment of ascii emojis',
	aliases: {
	},
	actions: {
		default: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			async execute(args, tags, message, channel, client) {
				let content = '';

				await functions.liveLoad(client, client.userID).then(() => {
					content += ' Live: ' + (client.isLive ? 'Yes' : 'No');
					functions.sayHandler(client, content);
				});
			},
		},
		chaos: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				if ('chaos-mode' in client.overlay) {
					if ('data' in client.overlay['chaos-mode']) {
						let content = 'Chaos mode word list: ';
						Object.entries(client.data.chaosMode).forEach(([data]) => {
							content += data + ', ';
						});
						content = content.substring(0, content.length - 2);
						functions.sayHandler(client, content);
					}
				}

				// Set chaosMode state...
				client.redeems.states.chaosMode = true;
				client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : 'force', 'redemptionID': 'force', 'content' : 'v', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));
				client.timeouts.make(
					'chaosMode',
					() => {
						client.redeems.states.chaosMode = false;
						client.timeouts.clear('chaosMode');
					},
					90000,
				);

			},
		},
		chatters: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				let content = ' Chatters: ' + (client.data.chatters.length ? client.data.chatters : 'None');
				content = content.substring(0, content.length - 2);
				content = content.trim();
				functions.sayHandler(client, content);
			},
		},
		timer: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {

				const content = `${tags.username}, this is delayed content...`;

				// Timer for output...
				client.timeouts.make(
					'checkTimer',
					(client, content) => {
						functions.sayHandler(client, content);
						client.timeouts.clear('checkTimer');
					},
					5000, client, content,
				);
			},
		},
		event: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {
				// const userstate = {
				// 	'display-name': tags['username'],
				// 	'bits': 100,
				// 	'message': message,
				// };
				// // Manually emit the event to test logic
				// client.emit('cheer', channel, userstate, message);
				client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'target': 'discord:' + client.userID, 'offline' : client.userID }, 'source': 'komfybot' }));
			},
		},
		uptime: {
			perms: {
				levels: ['admin'],
				error: 'this command is for admins only.',
			},
			execute(args, tags, message, channel, client) {
				let content = '';
				const launch = new Date(client.launch);
				const newDate = module.exports.getTimeSince(launch);
				content += `Launched: ${launch} || Uptime: ${newDate}`;
				functions.sayHandler(client, content);
			},
		},
		fuck: {
			execute(args, tags, message, channel, client) {
				module.exports.getLastPlayed(client, tags.username).then((data) => {
					console.log(data);
				});
			},
		},
	},
	getTimeSince(date) {

		let seconds = Math.floor(((new Date()) - date) / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		hours = hours - (days * 24);
		minutes = minutes - (days * 24 * 60) - (hours * 60);
		seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

		const str = `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
		return str;
	},
	async getLastPlayed(client, username) {
		const reponse = await axios.get(client.endpoint + 'shoutout/insert/' + username);
		const reponse2 = await axios.get(client.endpoint + 'shoutout/retrieve/' + username);

		const raidInfo = [];
		raidInfo['lastplayed'] = reponse2.data.response;
		raidInfo['recent'] = reponse.data.response;

		return raidInfo;
	},
};