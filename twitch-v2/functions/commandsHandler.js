module.exports = {
	function(command, channel, perms, tags, message, client) {
		const parent = this;
		const settings = command.command;
		const action = command.action;
		const args = command.args;
		// const channel = command.channel;

		// Check for allowOffline...
		if ('allowOffline' in settings) {
			// If allowOffline is false...
			if (!settings.allowOffline) {
				// And user isn't live...
				if (!client.isLive) {
					client.say(channel, 'This command cannot be used while the streamer is offline.').catch(() => {
						setTimeout(() => {
							client.say(channel, 'This command cannot be used while the streamer is offline.');
						}, 2500);
					});
					return;
				}
			}
		}

		// Handle basic actions
		if ('say' in action) {
			let output = action.say[0];
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

			// Handle the args...
			if (proceed) {
				if (action.args) {
					if ('required' in action.args) {
						Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
							if (!(value in args)) {
								proceed = false;
							}
						});
					}
					if (!proceed) {
						output = `${tags.username}, ${action.args.error}`;
					}
				}
			}

			// Handle cleaning the message...
			if (proceed) {
				// Handle special tags in message
				if (output.indexOf('{@sender}') !== -1) {
					output = output.replace('{@sender}', '@' + tags.username);
				}
				if (output.indexOf('{@target}') !== -1) {
					if (args.length > 1) {
						output = output.replace('{@target}', args[1]);
					}
					else {
						client.say(channel, 'You are missing a target for that command.').catch(() => {
							setTimeout(() => {
								client.say(channel, 'You are missing a target for that command.');
							}, 2500);
						});
						return true;
					}
				}
			}

			// Output output...
			client.say(channel, output).catch(() => {
				setTimeout(() => {
					client.say(channel, output);
				}, 2500);
			});
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

			// Select a random entry...
			let output = parent.funcRandomProperty(parent.funcShuffleObject(randomList));
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

			// Handle the args...
			if (proceed) {
				if (action.args) {
					if ('required' in action.args) {
						Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
							if (!(value in args)) {
								proceed = false;
							}
						});
					}
					if (!proceed) {
						output = `${tags.username}, ${action.args.error}`;
					}
				}
			}

			// Handle cleaning the message...
			if (proceed) {

				// Handle special tags in message
				if (output.indexOf('{@sender}') !== -1) {
					output = output.replace('{@sender}', '@' + tags.username);
				}
				if (output.indexOf('{@target}') !== -1) {
					if (args.length > 1) {
						output = output.replace('{@target}', args[1]);
					}
					else {
						client.say(channel, 'You are missing a target for that command.').catch(() => {
							setTimeout(() => {
								client.say(channel, 'You are missing a target for that command.');
							}, 2500);
						});
						return true;
					}
				}
			}

			// Output output...
			client.say(channel, output).catch(() => {
				setTimeout(() => {
					client.say(channel, output);
				}, 2500);
			});
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

					if ('required' in action.args) {
						Object.entries(action.args.required).forEach(([key, value]) => { // eslint-disable-line no-unused-vars
							if (!(value in args)) {
								proceed = false;
							}
						});
					}
					if (!proceed) {
						output = `${tags.username}, ${action.args.error}`;
					}

				}
			}

			// Handle cleaning the message...
			if (proceed) {

				// Handle special tags in message
				if (output.indexOf('{@sender}') !== -1) {
					output = output.replace('{@sender}', '@' + tags.username);
				}
				if (output.indexOf('{@target}') !== -1) {
					if (args.length > 1) {
						output = output.replace('{@target}', args[1]);
					}
					else {
						client.say(channel, 'You are missing a target for that command.').catch(() => {
							setTimeout(() => {
								client.say(channel, 'You are missing a target for that command.');
							}, 2500);
						});
						return true;
					}
				}
			}

			// If no output, execute the command...
			if (!output) {
				action.execute(args, tags, message, channel, client);
				return true;
			}
			// Otherwise, output output...
			else {
				client.say(channel, output).catch(() => {
					setTimeout(() => {
						client.say(channel, output);
					}, 2500);
				});
				return true;
			}
		}
	},
};
