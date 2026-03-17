import axios from 'axios';

export function randomObjProperty(obj) {
    const values = Object.keys(obj);
    const random = values[Math.floor(Math.random() * values.length)];
    return random;
};

export function randomObjValue(obj) {
    const values = Object.values(obj);
    const random = values[Math.floor(Math.random() * values.length)];
    return random;
};

export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffleObject(obj) {
    const entries = Object.entries(obj);
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    return Object.fromEntries(entries);
};

export function shuffleArray(array) {
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

export function getTimeSince(date) {
    let seconds = Math.floor(((new Date()) - date) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    const str = `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
    return str;
};

export function isInt(value) {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};

export function isNumeric(num) {
	const temp = num.toString();
	return !isNaN(parseFloat(num)) && isFinite(num) && (temp.indexOf('.') == -1);
};

export function getRandomNumber(max) {
	const rolls = [];
	const rolls2 = [];
	const rolls3 = [];

	let i;
	// Assign a bunch of "random rolls"
	for (i = 0; i < 10000; i++) {
		rolls.push(Math.floor(Math.random() * max) + 1);
	}
	// Lets filter that down to less rolls
	for (i = 0; i < 1000; i++) {
		const selected = Math.floor(Math.random() * rolls.length);
		rolls2.push(rolls[selected]);
		rolls.splice(selected, 1);
	}
	// More filtering
	for (i = 0; i < 100; i++) {
		const selected = Math.floor(Math.random() * rolls2.length);
		rolls3.push(rolls2[selected]);
		rolls2.splice(selected, 1);
	}
	// Pick the winner!
	const winner = rolls3[Math.floor(Math.random() * rolls3.length)];

	return winner;
};

export function isObjectEmpty(objectName) {
    return Object.keys(objectName).length === 0 && objectName.constructor === Object;
};

// Command Functions

export async function coincount(client, tags) {
    let coinCount = false;

    const p1 = new Promise((resolve) => {
        axios.get(client.endpoint + 'coins/retrieve/' + client.userID + '/' + tags['user-id'])
            .then(function(response) {
                const output = response.data;
                if (output.status === 'success') {
                    coinCount = (output.response ? output.response : 0);
                }
                else {
                    coinCount = 0;
                }
            })
            .catch(err => console.log(err))
            .finally(function() {
                resolve(coinCount);
            });
    });

    const results = await p1;
    return results;
};

export function handleGacha(category, items, rarity = false) {
    const parent = this;

    const rarities = {
        'common'		: 1,
        'uncommon'		: 2,
        'rare'			: 3,
        'super-rare'	: 4,
        'superrare'		: 4,
        'custom'		: 5,
    };

    let gachaOutput = '';

    // If passed a rarity, we output the items...
    if (rarity) {
        const rarityID = rarities[rarity];
        // Found the rarity...
        if (rarityID) {
            rarity = rarity.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
            gachaOutput = ` Here's your ${rarity} ${category}: `;
            Object.entries(items).forEach(([rarityLevel, setLevel]) => {
                if (rarityLevel == rarityID) {
                    Object.entries(setLevel).forEach(([set, items]) => { // eslint-disable-line no-unused-vars
                        Object.entries(items).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
                            gachaOutput += `${item['name']}, `;
                        });
                    });
                }
            });
            gachaOutput = gachaOutput.substring(0, gachaOutput.length - 2);
        }
        // Didn't, so return error-ish...
        else {
            gachaOutput = `Couldn't locate items with rarity: ${rarity}`;
        }
    }
    // Otherwise we do a breakdown...
    else {
        gachaOutput = ` Here's your ${category} breakdown: `;
        Object.entries(items).forEach(([rarityLevel, setLevel]) => {

            let rarityName = parent.getKeyByValue(rarities, rarityLevel);
            rarityName = rarityName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });

            let count = 0;
            Object.entries(setLevel).forEach(([set, items]) => { // eslint-disable-line no-unused-vars
                count += items.length;
            });

            gachaOutput += `${count} ${rarityName}, `;
        });
        gachaOutput = gachaOutput.substring(0, gachaOutput.length - 2);
    }

    return gachaOutput;
};

export function getKeyByValue(object, value) {
    let entry = false;
    Object.entries(object).forEach(([key, val]) => {
        if (val == value && !entry) {
            entry = key;
        }
    });
    return entry;
}