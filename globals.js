global.title = 'KiwiBot';

let configFile = 'D:/Personal Sites/#GIT/komfy-bot/config.json';
if (process.env.live === 'true') {
	configFile = '/etc/secrets/config.json';
}

global.configFile = configFile;