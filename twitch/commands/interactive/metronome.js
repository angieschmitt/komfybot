const dataFile = require('../../data/index');
const data = dataFile.content();

module.exports = {
	name: 'metronome',
	help: 'Randomly selects a move from the metronome move set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				const move = data.metronome[ randomIntFromInterval(0, data.metronome.length) ];

				// Assign some things
				const name = move['move'];
				const damage = parseInt(move['damage']);
				const hitChance = parseInt(move['hit_chance']);

				let content = `${tags.username} used ${name}! `;

				if (!isNaN(hitChance)) {
					// If guarenteed
					if (hitChance === 100) {
						if (!isNaN(damage)) {
							content += `They hit for ${move['damage']} damage! `;
						}
					}
					else {
						const check = randomIntFromInterval(1, 100);
						if (check <= hitChance) {
							if (!isNaN(damage)) {
								content += `They hit for ${move['damage']} damage! `;
							}
						}
						else {
							content += 'They missed! ';
						}
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

