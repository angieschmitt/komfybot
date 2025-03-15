module.exports = {
	name: 'rusty',
	help: 'Commands for the Rusty\'s Retirement game.',
	actions: {
		default: {
			execute(args, tags, message, channel, client) {
				let content = 'Basic Commands: ';
				content += '!join - Join the farm if there are free slots available || ';
				content += '!leave - Leave the farm || ';
				content += '!plant - Focus on planting crops || ';
				content += '!water - Focus on watering crops || ';
				content += '!harvest - Focus on harvesting crops || ';
				content += '!biofuel - Focus on loading biofuel converters || ';
				content += '!build - Focus on building || ';
				content += '!bench - Sit down and take rest || ';
				content += 'You can also do !rusty colors and !rusty advanced for more commands';

				client.say(channel, content);
			},
		},
		colors: {
			execute(args, tags, message, channel, client) {
				let content = 'Set your color: ';
				content += '!pink || ';
				content += '!blue || ';
				content += '!green || ';
				content += '!orange || ';
				content += '!red || ';
				content += '!purple || ';
				content += '!gray || ';
				content += '!gold (for subs only)';

				client.say(channel, content);
			},
		},
		advanced: {
			execute(args, tags, message, channel, client) {
				let content = 'Advanced commands: ';
				content += '!pick - Focus on picking berries (when unlocked) || ';
				content += '!feed - Focus on feeding animals (when unlocked) || ';
				content += '!collect - Focus on collecting poop (when unlocked) || ';
				content += '!fertilize - Focus on fertilizing crops (when unlocked)';

				client.say(channel, content);
			},
		},
	},
};