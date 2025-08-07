module.exports = {
	name: 'close',
	actions: {
		default: {
			execute(users, groups, source, data) {

				// console.log(users);
				// console.log(source);

				// remove closed connection
				users.splice(getKeyByValue(users, source), 1);

				// Check if we have a group case...
				const uniqueCheck = source.split(':');
				if (uniqueCheck !== null && Object.keys(uniqueCheck).length > 1) {

					// If there are no other users with this group, we remove it...
					let count = 0;
					users.forEach(element => {
						if (element.indexOf(uniqueCheck[0]) !== -1) {
							count++;
						}
					});
					if (count == 0) {
						groups.splice(getKeyByValue(groups, uniqueCheck[0]), 1);
					}
				}

				const output = {
					'userList': users,
					'groupList': groups,
					'data': data,
					'target': 'all',
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

