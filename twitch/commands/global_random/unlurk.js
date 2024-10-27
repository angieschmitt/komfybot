module.exports = {
	name: 'unlurk',
	help: 'Let chat know you\'re back from lurk mode',
	actions: {
		default:{
			say: 'Welcome back!',
		},
		komfykiwi: {
			execute(args, tags, message, channel, client) {
				let content = '';

				const followUps = [
					'We missed you a bunch!',
					'Hope ya got done whatever ya needed to do!',
					'You missed Kiwi being a dingus. Give it 5 minutes, she\'ll do it again.',
				];

				content += `Welcome back, ${tags.username}! <FOLLOW_UP>`;
				content = content.replace('<FOLLOW_UP>', randomProperty(followUps));

				client.say(channel, `${content}`);
			},
		},
	},
};

const randomProperty = function(obj) {
	const keys = Object.keys(obj);
	return obj[keys[ keys.length * Math.random() << 0]];
};