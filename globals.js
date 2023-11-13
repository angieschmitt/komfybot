global.title = 'KiwiBot';
global.baseUrl = 'https://kittenangie.com/bots/api_new/';
global.baseUrl2 = 'https://kittenangie.com/bots/1.0/';

let configFile = 'D:/Personal Sites/#GIT/komfy-bot/config.json';
if (process.env.live === 'true') {
	configFile = '/etc/secrets/config.json';
}

global.configFile = configFile;