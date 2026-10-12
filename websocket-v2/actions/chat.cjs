module.exports = {
	name: 'chat',
	actions: {
		default: {
			execute(users, groups, source, data) {

                console.log(data);

				const userKeys = Object.keys(users);
				const userKey = getKeyByValue(userKeys, data['target']);

                // No groups here, hard assign to the two versions..
				let target = [ userKey+':default', userKey+':custom' ];

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

