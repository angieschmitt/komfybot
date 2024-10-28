const triviaFile = require('../../data/trivia');
const trivia = triviaFile.content();

module.exports = {
	name: 'quiz',
	help: 'Outputs a current value of the counter. Additional arguments: set, reset',
	aliases: {
		'trivia': {
			arg: false,
			list: false,
		},
		'answer': {
			arg: 'answer',
			list: false,
		},
	},
	data: {
		qa: false,
		time: false,
	},
	actions: {
		default: {
			// perms: {
			// 	levels: ['mod'],
			// 	error: 'This is a mod only command',
			// },
			execute(args, tags, message, channel, client) {
				// Define stuff
				let qa = false;
				let content = '';

				// Check if existing question is set
				const now = Date.now();
				if (module.exports.data.time !== false) {
					const diff = (module.exports.data.time - now) / (1000 * 60);
					if (diff > 0) {
						// Snag the set QA to use
						qa = module.exports.data.qa;
					}
				}

				// Nothing set, so now we...
				if (!qa) {
					// Snag a random QA to use
					qa = trivia[ randomIntFromInterval(0, trivia.length) ];
					// Set it as the current question, set the timeout
					module.exports.data.qa = qa;
					module.exports.data.time = new Date(Date.now() + 1 * 60000);
				}

				if (qa) {
					content = `Trivia time: ${qa['q']} Use !answer to answer!`;
				}
				else {
					content = 'Uh... something went wrong. Tell @kittenangie.';
				}

				client.say(channel, `${content}`);
			},
		},
		answer: {
			// help: 'MOD command to reset the amount on the counter. !count reset',
			// perms: {
			// 	levels: ['mod'],
			// 	error: 'This is a mod only command',
			// },
			execute(args, tags, message, channel, client) {
				// Define stuff
				let qa = false;
				let content = '';

				if (!args[2]) {
					content += `@${tags.username}, you forgot your answer.`;
				}
				else if (module.exports.data.qa === false) {
					content += `@${tags.username}, seems like there isn't a trivia question to answer.`;
				}
				else {
					qa = module.exports.data.qa;
				}

				if (qa) {
					const userAnswer = message.replace(args[0], '').replace(args[1], '').trim().toLowerCase();
					const answer = qa['a'].trim().toLowerCase();

					if (userAnswer == answer) {
						// Wooo!
						content += `Congrats to @${tags.username}, who answered correctly with: ${qa['a']}`;
						// Reset QA data
						module.exports.data.qa = false;
						module.exports.data.time = false;
					}
					else {
						// Whomp
						content += `Nope, try again @${tags.username}!`;
					}
				}

				client.say(channel, `${content}`);
			},
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}