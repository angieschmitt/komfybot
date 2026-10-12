module.exports = {
	name: 'chat',
	actions: {
		default: {
			execute(users, groups, source, data) {

                console.log(data);

                // No groups here, hard assign to the two versions..
				let target = [ data['target'] + ':default', data['target'] + ':custom' ];

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

