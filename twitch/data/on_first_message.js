const on_first_message = {
	'komfykiwi': {
		'488465989': {
			execute: [
				'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
			],
		},
		'37718291': {
			execute: [
				'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
			],
		},
		'547517825': {
			say: [
				'Welcome in! @ipokeholes_717 has arrived!',
			],
			execute: [
				'data.functions.handleWebsocketRedeem(\'lizard\', { \'file\': \'whos-that-pokemon\', \'from\': \'walk-on\' }, client)',
			],
		},
		'90928645': {
			say: [ 'Welcome in! @kittenAngie has arrived!' ],
			execute: [
				'data.functions.handleWebsocketRedeem(\'lizard\', { \'file\': \'cute-and-fluffy\', \'from\': \'walk-on\' }, client)',
			],
		},
	},
	'kittenangie': {
		'488465989': {
			execute: [
				'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
			],
		},
		'37718291': {
			execute: [
				'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
			],
		},
	},
};

module.exports = {
	content: function() {
		return on_first_message;
	},
};