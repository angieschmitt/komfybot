export function shuffle(array) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex],
		];
	}
};

export function ucwords(str) {
	return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
		return $1.toUpperCase();
	});
}

export function getRandomNumber(max, exclude = []) {
	const baseNumbers = [];

	// Make a list of all numbers between 0 and max
	let i;
	for (i = 1; i <= max; i++) {
		baseNumbers.push(i);
	}

	// Remove any exludes
	if (exclude.length > 0) {
		exclude.forEach((element) => {
			if (element != false) {
				if (baseNumbers.indexOf(element) != -1) {
					baseNumbers.splice(baseNumbers.indexOf(element), 1);
				}
			}
		});
	}

	// Prep the rolls
	const rolls = baseNumbers;
	const rolls2 = [];
	const rolls3 = [];
	const rolls4 = [];
	const rolls5 = [];
	let finalRolls = [];

	// Now shuffle them
	shuffle(rolls);

	if (rolls.length > 2) {
		// Reduce those
		const rollsLength = Math.floor(rolls.length / 2);
		for (i = 0; rolls2.length < rollsLength; i++) {
			const selected = Math.floor(Math.random() * rolls.length);
			const value = rolls[selected];
			rolls2.push(value);
			rolls.splice(selected, 1);
		}
		finalRolls = rolls2;
	}

	if (rolls2.length > 2) {
		const rolls2Length = Math.floor(rolls2.length / 2);
		for (i = 0; rolls3.length < rolls2Length; i++) {
			const selected = Math.floor(Math.random() * rolls2.length);
			const value = rolls2[selected];

			rolls3.push(value);
			rolls2.splice(selected, 1);
		}
		finalRolls = rolls3;
	}

	if (rolls3.length > 2) {
		// Reduce those
		const rolls3Length = Math.floor(rolls3.length / 2);
		for (i = 0; rolls4.length < rolls3Length; i++) {
			const selected = Math.floor(Math.random() * rolls3.length);
			const value = rolls3[selected];

			rolls4.push(value);
			rolls3.splice(selected, 1);
		}
		finalRolls = rolls4;
	}

	if (rolls4.length > 2) {
		// Reduce those
		const rolls4Length = Math.floor(rolls4.length / 2);
		for (i = 0; rolls5.length < rolls4Length; i++) {
			const selected = Math.floor(Math.random() * rolls4.length);
			const value = rolls4[selected];

			rolls5.push(value);
			rolls4.splice(selected, 1);
		}
		finalRolls = rolls5;
	}

	// Pick the winner!
	const winner = finalRolls[Math.floor(Math.random() * finalRolls.length)];

	return winner;
};

export async function loopingFunction(goal, interaction, messageID = false) {
	if (!messageID) {
		messageID = interaction.id;
	}

	let chunk = 0;
	if (goal >= 100) {
		chunk = 100;
	}
	else {
		chunk = goal;
	}

	const result = await actuallyDeleteThings(chunk, interaction, messageID);
	// console.log('Promise resolved: ' + result);
	if ((goal - 100) > 0 && result !== true) {
		loopingFunction((goal - 100), interaction, result);
	}
	else {
		interaction.editReply('Messages erasing, please be patient.');
	}
}

export function actuallyDeleteThings(amount, interaction, before) {
	return new Promise((resolve, reject) => {
		let count = 1;
		let lastMessage = false;
		const channel = interaction.channel;
		channel.messages.fetch({ limit: amount, cache: false, before: before })
			.then(messageList => {

				// If 100, we drop 1
				if (amount === 100) {
					// Define the last message
					messageList.forEach(message => {
						if (count == messageList.size) {
							lastMessage = message.id;
						}
						count++;
					});

					// Now we loop over messages
					messageList.forEach(message => {
						// If it's not the defined lastMessage, we do stuff
						if (message.id !== lastMessage) {
							setTimeout(
								() => {
									// console.log('Delete ' + message.id);
									message.delete();
								},
								1000,
							);
						}
					});
				}
				else {
					messageList.forEach(message => {
						setTimeout(
							() => {
								message.delete();
							},
							1000,
						);
					});
					lastMessage = true;
				}
			})
			.catch((err) => {
				reject(console.log(err));
			})
			.finally(() => {
				const interval = setInterval(() => {
					if (lastMessage != false) {
						clearInterval(interval);
						resolve(lastMessage);
					}
				}, 1000);
			});
	});
}