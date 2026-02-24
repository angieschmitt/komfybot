module.exports = {
	name: 'speak',
	actions: {
		default: {
			execute(users, groups, source, data) {

				const userKeys = Object.keys(users);
				const userKey = getKeyByValue(userKeys, data['target']);

				let target = [ userKey ];
				if (target[0] === undefined) {
					// Let's check for a group...
					const groupKeys = Object.keys(groups);
					const groupKey = getKeyByValue(groupKeys, data['target']);
					if (groupKey !== undefined) {
						// Found the group
						target = [];
						Object.entries(users).forEach(([item]) => {
							if (item.indexOf(data['target'] + ':') > -1) {
								const tempKey = getKeyByValue(userKeys, item);
								target.push(tempKey);
							}
						});
					}
				}

				data['target'] = target;

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

