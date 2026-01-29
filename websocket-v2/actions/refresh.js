module.exports = {
	name: 'refresh',
	actions: {
		default: {
			execute(users, groups, source, data) {

				const userKeys = Object.keys(users);
				const userKey = getKeyByValue(userKeys, source);

				let target = [ userKey ];

				// Specific overrides
				if (data['target'] === 'all') {
					target = 'all';
				}

				const output = {
					'data': data,
					'target': target,
					'source': source,
				};
				return output;
			},
		},
	},
};

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

