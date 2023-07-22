const tmi = require('tmi.js');
const axios = require('axios');

// Define configuration options
const opts = {
	identity: {
		username: 'komfybot',
	},
	channels: [
		'komfykiwi',
		// 'alazysun',
	],
};

axios.get('https://www.kittenangie.com/bots/api/get_key.php?2')
	.then(function(response) {
		opts.identity.password = response.data.key;
	})
	.then(function() {
		// Create a client with our options
		const client = new tmi.client(opts);

		// Register our event handlers (defined below)
		client.on('connected', onConnectedHandler);
		client.on('message', onMessageHandler);

		// Connect to Twitch:
		client.connect();

		// Called every time the bot connects to Twitch chat
		function onMessageHandler(channel, tags, message, self) {
			if (self) { return; }

			const commandName = message.trim();

			let perms = [];
			if (tags.mod) { perms.mod = true; }
			if (tags.vip) { perms.vip = true; }
			if (tags.subscriber) { perms.sub = true; }

			// console.groupCollapsed('Message');
			// console.log(tags);
			// console.groupEnd();

			console.log(tags.username);
			console.log(perms);
			console.log('- - -');

			if (commandName.indexOf('!') == 0) {
				if (commandName === '!banana') {
					if (tags.username === 'kittenangie') {
					// if (perms.mod) {
						client.say(channel, '🍌🍌🍌🍌🍌🍌🍌');
					}
				}
				if (commandName === '!potato') {
					if (tags.username === 'kittenangie') {
						// if (perms.mod) {
						client.say(channel, '🥔🥔🥔🥔🥔🥔🥔');
					}
				}
				if (commandName === '!kiwiquote') {
					if (perms.mod) {
						let content = '';
						axios.get('https://kittenangie.com/bots/api/endpoint.php?request=quote')
							.then(function(response) {
								const output = response.data;
								if (output.status === 'success') {
									content = 'Kiwi once said... ' + output.content;
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
					}
				}
				if (commandName === '!kiwipun') {
					if (perms.mod) {
						let content = '';
						axios.get('https://kittenangie.com/bots/api/endpoint.php?request=pun')
							.then(function(response) {
								const output = response.data;
								if (output.status === 'success') {
									content = 'Pun Delivery Service: ' + output.content;
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
					}
				}
				if (commandName.indexOf('!kiwi8') === 0) {
					if (perms.mod) {
						let content = '';
						axios.get('https://kittenangie.com/bots/api/endpoint.php?request=8ball')
							.then(function(response) {
								const output = response.data;
								if (output.status === 'success') {
									content = `@${tags.username} the Magic 8 Ball says... ` + output.content;
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
					}
				}
			}
		}

		// Called every time the bot connects to Twitch chat
		function onConnectedHandler(addr, port) {
			console.log(`* Connected to ${addr}:${port}`);
		}
	});