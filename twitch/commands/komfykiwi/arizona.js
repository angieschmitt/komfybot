module.exports = {
	name: 'arizona',
	channel: ['komfykiwi', 'yourpalmal'],
	help: 'The official drink of KomfyKiwi #NotSponsoredYet',
	actions: {
		default: {
			// say: 'Remember to stay HYDRATED with Arizona Green Tea with Gingseng and Honey!',
			execute(args, tags, message, channel, client) {
				let content = '';
				const check = randomIntFromInterval(0, 1);

				const shills = {
					'1' : 'Remember to stay HYDRATED with Arizona Green Tea with Gingseng and Honey!',
					'2' : 'Are you interested in a healthy, beautifully packaged tea drink from a company that cares about it\'s consumers, all for the wonderful price of 99 cents? Pick up an Arizona Green Tea with Gingseng and Honey today!',
				};

				content += shills[ Object.keys(shills)[check] ];

				client.say(channel, `${content}`);
			},
		},
		test: {
			say: 'Successfully tested',
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}