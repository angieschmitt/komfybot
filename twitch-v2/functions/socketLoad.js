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
					let iter = 0;
					Object.entries(data.userList).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
						if (iter == element) {
							targets.push(idx);
						}
						iter++;
					});
				});
			}

			// Now only run if it's supposed to...
			if (data.action === 'ping' && targets.includes('komfybot:' + client.userID)) {
				const content = 'Beep Boop';
				parent.sayHandler(client, content);
			}
			else if (data.action === 'speak' && targets.includes('komfybot:' + client.userID)) {
				const content = data['data']['message'];
				parent.sayHandler(client, content);
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