module.exports = {
	async function(client) {
		const timerInterval = 60000;
		// const timerInterval = 10000;

		// If not set up, set it up
		if (!('timerOffset' in client)) {
			// TO DO: Set timer based off stream up time
			client.timerOffset = 1;
		}

		// Now load in the timerOffsets
		if ('timerOffset' in client) {

			setInterval(
				function() {
					console.log('Timer - ' + client.userID + ' : ' + client.timerOffset);

					// Enter messages into queue
					const timerQueue = {};
					Object.entries(client.timers).forEach(([index, data]) => {
						if ((client.timerOffset % data['timer']) == 0) {
							if (!Object.keys(timerQueue).length) {
								timerQueue[ index ] = data;
							}
							else {
								Object.keys(timerQueue).forEach(key => delete timerQueue[key]);
								timerQueue[ index ] = data;
							}
						}
					});

					// If the queue has items, handle them...
					if (Object.keys(timerQueue).length) {

						const ident = Object.keys(timerQueue)[0];
						const messageData = timerQueue[ident];

						if (client.lastMessage !== messageData['message']) {
							if (client.isLive) {
								console.log('Timer: SENT ' + ident + ' IN ' + client['channel']);
								client.say(client['channel'], messageData['message']);
								Object.keys(timerQueue).forEach(key => delete timerQueue[key]);
							}
							else {
								console.log('Timer: SKIPPED - ' + ident + ' IN ' + client['channel']);
								Object.keys(timerQueue).forEach(key => delete timerQueue[key]);
							}
						}
					}

					client.timerOffset++;
				},
				timerInterval,
			);
		}
	},
	isObjectEmpty(objectName) {
		return Object.keys(objectName).length === 0 && objectName.constructor === Object;
	},
};