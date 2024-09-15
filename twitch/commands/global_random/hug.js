module.exports = {
	name: 'hug',
	help: 'Hug someone in a random way.',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				if (args.length > 1) {
					const who = message.replace(args[0], '').trim();
					content += `${tags.username} has given ${who} <HUG_TYPE>.`;
				}
				else {
					content += `${tags.username} has given @${channel.substring(1)} <HUG_TYPE>.`;
				}

				const hugs = [
					'the MOST platonic hug',
					'a hug and a high five',
					'a hugburger deluxe with fries',
					'the second best hug they\'ve ever had',
					'a hug they\'ll never forget',
					'a hug',
					'a cookie, for some reason',
					'a request for ONE FUTURE HUG',
				];

				content = content.replace('<HUG_TYPE>', randomProperty(hugs));

				client.say(channel, content);
			},
		},
	},
};

const randomProperty = function(obj) {
	const keys = Object.keys(obj);
	return obj[keys[ keys.length * Math.random() << 0]];
};