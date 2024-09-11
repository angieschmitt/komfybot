const on_first_message = {
	'komfykiwi': {
		'90928645' : {
			say: 'Hi boss!',
		},
		'488465989': {
			execute: 'client.commands[\'global\'].checkin.actions.default.execute(false, tags, message, channel, client)',
		},
	},
};

module.exports = {
	content: function() {
		return on_first_message;
	},
};