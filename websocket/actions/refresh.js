module.exports = {
	name: 'refresh',
	actions: {
		default: {
			execute(users, groups, source, data) {

				// console.log(users);
				// console.log(source);
				// console.log(data);

				let target = [ getKeyByValue(users, source) ];

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

