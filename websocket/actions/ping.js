module.exports = {
	name: 'ping',
	actions: {
		default: {
			execute(users, groups, source, data) {

				let target = [ getKeyByValue(users, data['target']) ];
				if (target[0] === undefined) {
					// Let's check for a group...
					const group = getKeyByValue(groups, data['target']);
					if (group !== undefined) {
						// Found the group
						target = [];
						users.forEach((element, idx) => {
							if (element.indexOf(data['target'] + ':') > -1) {
								target.push(idx.toString());
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

