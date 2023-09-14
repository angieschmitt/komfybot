const fs = require('fs');

module.exports = {
	name: 'metronome',
	description: 'PKMN Metronome',
	help: 'Randomly selects a move from the metronome move set',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = '';
				fs.readFile('data/metronome-moves.csv', 'utf-8', function(err, data) {

					if (err) { console.log(err); }

					const lines = data.split('\n');
					const line = lines[Math.floor(Math.random() * lines.length)].split(',');

					console.log(line);

					const hitChance = parseInt(line[6]);
					const hitDamage = parseInt(line[5]);
					content += `${tags.username} used ${line[1]}! `;
					if (!isNaN(hitChance)) {
						if (hitChance === 100) {
							if (!isNaN(hitDamage)) {
								content += `They hit for ${line[5]} damage! `;
							}
						}
						else {
							const check = randomIntFromInterval(1, 100);
							if (check <= parseInt(line[6])) {
								if (!isNaN(hitDamage)) {
									content += `They hit for ${line[5]} damage! `;
								}
							}
							else {
								content += 'They missed! ';
							}
						}
					}
					else if (!isNaN(hitDamage)) {
						content += `They hit for ${line[5]} damage! `;
					}

					client.say(channel, `${content}`);
				});
			},
		},
	},
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}