module.exports = {
	function(command, channel, perms, tags, message, client) {
		const parent = this;
		const action = command.action;
		const args = command.args;
		// const channel = command.channel;

		// Handle basic actions
		if ('say' in action) {
			let output = action.say;
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms !== undefined) {
				if (action.perms) {
					let hasPerm = false;
					for (const [key] of Object.entries(perms)) {
						if (action.perms['levels'].includes(key)) {
							hasPerm = true;
						}
					}
					if (!hasPerm) {
						output = `${tags.username}, ${action.perms.error}`;
						proceed = false;
					}
				}
			}

			// Handle the action now
			// TO DO: Args?
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 2 because !command and first arg
					let count = 2;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') { count++; }
					}
					// Check full length vs required count
					if (args.length < count) {
						// console.log('Missed an argument');
						return false;
					}

					for (const [key] of Object.entries(action.args)) {
						if (args[(parseInt(key) + 1)] === undefined) {
							if (action.args[key][1] === 'tags.username') {
								output = output.replace('@' + key, tags.username);
							}
						}
						else {
							output = output.replace('@' + key, args[(parseInt(key) + 1)]);
						}
					}
				}
			}

			// Handle special tags in message
			if (output.indexOf('{@sender}') !== -1) {
				output = output.replace('{@sender}', '@' + tags.username);
			}
			if (output.indexOf('{@target}') !== -1) {
				if (args.length > 1) {
					output = output.replace('{@target}', args[1]);
				}
				else {
					client.say(channel, 'You are missing a target for that command.');
					return true;
				}
			}

			// Output output...
			client.say(channel, `${output}`);
			return true;
		}
		else if ('random' in action) {

			// Strip out content with {@target} if there isn't one...
			let randomList = Array.from(action.random);
			if (args.length == 1) {
				for (let i = randomList.length - 1; i >= 0; i--) {
					if (randomList[i].indexOf('{@target}') != -1) {
						randomList.splice(i, 1);
					}
				}
			}

			if (randomList.length == '0') {
				randomList = action.random;
			}

			// Select a random entr
			let output = parent.randomProperty(parent.shuffleObject(randomList));
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms !== undefined) {
				if (action.perms) {
					let hasPerm = false;
					for (const [key] of Object.entries(perms)) {
						if (action.perms['levels'].includes(key)) {
							hasPerm = true;
						}
					}
					if (!hasPerm) {
						output = `${tags.username}, ${action.perms.error}`;
						proceed = false;
					}
				}
			}

			// Handle the action now
			// TO DO: Args?
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 2 because !command and first arg
					let count = 2;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') { count++; }
					}
					// Check full length vs required count
					if (args.length < count) {
						// console.log('Missed an argument');
						return false;
					}

					for (const [key] of Object.entries(action.args)) {
						if (args[(parseInt(key) + 1)] === undefined) {
							if (action.args[key][1] === 'tags.username') {
								output = output.replace('@' + key, tags.username);
							}
						}
						else {
							output = output.replace('@' + key, args[(parseInt(key) + 1)]);
						}
					}
				}
			}

			// Handle special tags in message
			if (output.indexOf('{@sender}') !== -1) {
				output = output.replace('{@sender}', '@' + tags.username);
			}
			if (output.indexOf('{@target}') !== -1) {
				if (args.length > 1) {
					output = output.replace('{@target}', args[1]);
				}
				else {
					client.say(channel, 'You are missing a target for that command.');
					return true;
				}
			}

			// Output output...
			client.say(channel, `${output}`);
			return true;
		}
		else if ('execute' in action) {
			let output = '';
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms) {
				let hasPerm = false;
				for (const [key] of Object.entries(perms)) {
					if (action.perms['levels'].includes(key)) {
						hasPerm = true;
					}
				}
				if (!hasPerm) {
					output = `${tags.username}, ${action.perms.error}`;
					proceed = false;
				}
			}

			// Handle the action now
			if (proceed) {
				if (action.args) {
					// Find out how many required, start at 1 because !command
					let count = 1;
					for (const [key] of Object.entries(action.args)) {
						if (action.args[key][0] === 'r') {
							count++;
						}
					}
					// Check full length vs required count
					if (args.length < count) {
						output = `${tags.username}, ${action.args.error}`;
						proceed = false;
					}
				}
			}

			// Output... something...
			if (!output) {
				action.execute(args, tags, message, channel, client);
				return true;
			}
			else {
				client.say(channel, `${output}`);
				return true;
			}
		}
	},
};
