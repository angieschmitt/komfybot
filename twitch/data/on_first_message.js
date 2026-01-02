const on_first_message = {
	'komfykiwi': {
		'488465989': {
			execute: 'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
		},
		'37718291': {
			execute: 'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
		},
		'547517825': {
			execute: 'data.functions.handleWebsocketRedeem(\'lizard\', { \'file\': \'whos-that-pokemon\', \'from\': \'walk-on\' }, client)',
		},
		'90928645': {
			execute: 'data.functions.handleWebsocketRedeem(\'lizard\', { \'file\': \'cute-and-fluffy\', \'from\': \'walk-on\' }, client)',
		},
	},
	'kittenangie': {
		'488465989': {
			execute: 'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
		},
		'37718291': {
			execute: 'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
		},
		// '90928645': {
		// 	execute: 'data.functions.handleWebsocketRedeem(\'lizard\', { \'file\': \'whos-that-pokemon\', \'from\': \'walk-on\' }, client)',
		// },
	},
};

module.exports = {
	content: function() {
		return on_first_message;
	},
};