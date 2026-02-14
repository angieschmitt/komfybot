const settingsFile = require('./settings');
const settings = settingsFile.content();

const functionsFile = require('./functions/index');
const functions = functionsFile.content();

// const debugFile = require('./debug/index');
// const debug = debugFile.content();
// debug.init();

const globals = [];
globals['endpoint'] = settings.endpoint;
globals['websocket'] = settings.socket[ settings.env ];

// Create containers...
globals['bots'] = {};

// Create the bots...
functions.createBots(globals)
	.then((bots) => {
		globals['bots'] = bots;
		globals['refreshHandler'] = functions.dashboardRefresh(globals);
	});