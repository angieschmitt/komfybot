const ws = require('ws');

module.exports = {
	async function(client) {
		const parent = this;

		// let interval = false;
		const identifier = 'komfybot:' + client.userID;
		const websocket = new ws('wss://' + client.socketInfo.ip + ':' + client.socketInfo.port + '/' + identifier, { rejectUnauthorized: false });

		websocket.onopen = () => {
			websocket.send(JSON.stringify({ 'action': 'refresh', 'data': { 'target': 'all' }, 'source': identifier }));
			// data.debug.write('global', 'WEBSOCKET_CONNECTED');
		};

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			// Setup targets for checking against...
			const targets = [];
			if (typeof data.target === 'object') {
				data.target.forEach(element => {
					targets.push(data.userList[ element ]);
				});
			}

			// Now only run if it's supposed to...
			if (data.action === 'ping' && targets.includes('komfybot:' + client.userID)) {
				// client.say(client.channel, 'Pong').catch(() => {
				// 	setTimeout(() => {
				// 		client.say(client.channel, 'Pong');
				// 	}, 2500);
				// });
			}
			else if (data.action === 'speak' && targets.includes('komfybot:' + client.userID)) {
				client.say(client.channel, data['data']['message']).catch(() => {
					setTimeout(() => {
						client.say(client.channel, data['data']['message']);
					}, 2500);
				});
			}
		};

		websocket.onerror = (error) => {
			console.log(error.message);
		};

		websocket.onclose = () => {
			setTimeout(function() {
				parent.socketLoad(client);
			}, 1000, client);
		};

		setInterval(() => {
			if (websocket.readyState != 0) {
				websocket.send(JSON.stringify({ 'action': 'live-check', 'data': { 'timestamp': new Date().toISOString() }, 'source': identifier }));
			}
		}, 10000);

		client.websocket = websocket;
	},
};