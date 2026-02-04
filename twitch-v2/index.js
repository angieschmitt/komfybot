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

// Handle creating bots...
globals['bots'] = [];
globals['bots'] = functions.createBots(globals);

// Handle refreshing commands and timers...
globals['refreshHandlers'] = [];
globals['refreshHandlers']['load'] = functions.refreshHandler(globals);
// globals['refreshHandlers']['live'] = functions.liveRefreshHandler(globals); <- Replaced with eventsub

// Handle watching for redeems...
// globals['redeemWatcher'] = functions.redeemWatcher(globals); <- Replaced with eventsub