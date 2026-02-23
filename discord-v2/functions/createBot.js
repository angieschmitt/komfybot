module.exports = {
	async function(client) {
		const parent = this;

		client.intervals = {
			// to keep a reference to all the intervals
			intervals : new Array,

			// create another interval
			make(...args) {
				const id = args.shift();
				const newInterval = setInterval(...args);
				this.intervals[id] = newInterval;
				return newInterval;
			},

			// clear a single interval
			clear(id) {
				delete this.intervals.id;
				return clearInterval(this.intervals[id]);
			},

			// clear all timeouts
			clearAll() {
				Object.entries(this.intervals).forEach(([idx]) => {
					this.clear(idx);
				});
			},
		};
		client.timeouts = {
			// to keep a reference to all the timeouts
			timeouts : new Array,

			// create another timeouts
			make(...args) {
				const id = args.shift();
				const newTimeout = setTimeout(...args);
				this.timeouts[id] = newTimeout;
				return newTimeout;
			},

			// clear a single timeouts
			clear(id) {
				delete this.timeouts.id;
				return clearTimeout(this.timeouts[id]);
			},

			// clear all timeouts
			clearAll() {
				Object.entries(this.timeouts).forEach(([idx]) => {
					this.clear(idx);
				});
			},
		};

		// Load commands...
		await parent.loadCommands(client);
		await parent.loadEvents(client);

		await parent.socketLoad(client);
		await parent.loadToken(client);
		await parent.loadSettings(client);

		// Log in to Discord with your client's token
		client.login(client.token).catch(console.error);

		return client;
	},
};