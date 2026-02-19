module.exports = {
	function(channel, tags) {

		// Set the defaults...
		const perms = {
			'admin' : (tags['user-id'] == '90928645' ? true : false),
			'streamer' : (('#' + tags.username == channel) ? true : false),
			'mod' : (tags.mod ? true : false),
			'vip' : (tags.vip ? true : false),
			'sub' : (tags.subscriber ? true : false),
		};

		// For some reason, streamers aren't mods on their own channel...
		if ('#' + tags.username == channel) {
			perms.mod = true;
		}

		return perms;

	},
};

