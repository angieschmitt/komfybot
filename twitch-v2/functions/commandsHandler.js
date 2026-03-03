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
					const content = 'This command cannot be used while the streamer is offline.';
					parent.sayHandler(client, content);
					return;
				}
			}
		}

		// Handle basic actions
		if ('say' in action) {
			let output = action.say[0];
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms && action.perms !== undefined) {
				let hasPerm = false;
				action.perms['levels'].forEach((perm) => {
					if (perms[perm]) {
						hasPerm = true;
					}
				});
				if (!hasPerm) {
					output = `@${tags.username}, ${action.perms.error}`;
					proceed = false;
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
				output = module.exports.replaceContentInMessage(output, args, tags);
				if (output === false) {
					const content = 'You are missing a target for that command.';
					parent.sayHandler(client, content);
					return true;
				}
			}

			// Output output...
			parent.sayHandler(client, output);
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
			if (action.perms && action.perms !== undefined) {
				let hasPerm = false;
				action.perms['levels'].forEach((perm) => {
					if (perms[perm]) {
						hasPerm = true;
					}
				});
				if (!hasPerm) {
					output = `@${tags.username}, ${action.perms.error}`;
					proceed = false;
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
				output = module.exports.replaceContentInMessage(output, args, tags);
				if (output === false) {
					const content = 'You are missing a target for that command.';
					parent.sayHandler(client, content);
					return true;
				}
			}

			// Output output...
			parent.sayHandler(client, output);
			return true;
		}
		else if ('delayed' in action) {

			// Handle perms/proceed, die here if bad...
			if (action.perms && action.perms !== undefined) {
				let hasPerm = false;
				action.perms['levels'].forEach((perm) => {
					if (perms[perm]) {
						hasPerm = true;
					}
				});
				if (!hasPerm) {
					const output = `@${tags.username}, ${action.perms.error}`;
					parent.sayHandler(client, output);
					return false;
				}
			}

			// Check for required targets...
			const entries = Object.entries(action.delayed);
			for (let i = 0; i < entries.length; i++) {
				const [idx, data] = entries[i]; // eslint-disable-line no-unused-vars
				const check = module.exports.replaceContentInMessage(data[0], args, tags);
				if (check === false) {
					const content = 'You are missing a target for that command.';
					parent.sayHandler(client, content);
					return true;
				}
			}

			// If we've made it here...
			let delay = 0;
			Object.entries(action.delayed).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
				// Create the delays...
				client.timeouts.make(
					settings.name + '-Timer-' + idx,
					() => {
						const content = module.exports.replaceContentInMessage(data[0], args, tags);
						if (content !== '') {
							parent.sayHandler(client, module.exports.replaceContentInMessage(data[0], args, tags));
						}
						client.timeouts.clear(settings.name + '-Timer-' + idx);
					},
					(delay * 1000),
				);
				// Increase the delay...
				delay += parseInt(data[1]);
			});

			return true;
		}
		else if ('execute' in action) {
			let output = '';
			let proceed = true;

			// Handle perms/proceed, assign output if needed
			if (action.perms && action.perms !== undefined) {
				let hasPerm = false;
				action.perms['levels'].forEach((perm) => {
					if (perms[perm]) {
						hasPerm = true;
					}
				});
				if (!hasPerm) {
					output = `@${tags.username}, ${action.perms.error}`;
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
						const content = 'You are missing a target for that command.';
						parent.sayHandler(client, content);
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
				parent.sayHandler(client, output);
				return true;
			}
		}
	},
	replaceContentInMessage(message, args, tags) {

		// map to output
		let messageCleaned = message.trim();

		// If there is actually a message...
		if (messageCleaned !== '') {
			// Handle special tags in message
			if (messageCleaned.indexOf('{@sender}') !== -1) {
				messageCleaned = message.replace('{@sender}', '@' + tags.username);
			}
			if (messageCleaned.indexOf('{@target}') !== -1) {
				if (args.length > 1) {
					messageCleaned = messageCleaned.replace('{@target}', args[1]);
				}
				else {
					return false;
				}
			}
		}

		return messageCleaned;
	},
};
