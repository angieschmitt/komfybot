module.exports = {
	name: 'close',
	actions: {
		default: {
			execute(users, groups, source, data) {

				// remove closed connection
				delete users[source];

				// Check if we have a group case...
				const uniqueCheck = source.split(':');
				if (uniqueCheck !== null && Object.keys(uniqueCheck).length > 1) {

					// If there are no other users with this group, we remove it...
					let count = 0;
					Object.entries(users).forEach(([item]) => {
						if (item.indexOf(uniqueCheck[0]) !== -1) {
							count++;
						}
					});
					if (count == 0) {
						delete groups[uniqueCheck[0]];
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

