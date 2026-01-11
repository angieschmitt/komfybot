module.exports = {
	function(channel, tags) {

		const perms = {};
		if ('#' + tags.username == channel) {
			perms.streamer = true;
			perms.mod = true;
		}
		if (tags.mod) { perms.mod = true; }
		if (tags.vip) { perms.vip = true; }
		if (tags.subscriber) { perms.sub = true; }
		if (tags['user-id'] == '90928645') {
			perms.admin = true;
		}
		else {
			perms.admin = false;
		}

		return perms;

	},
};

