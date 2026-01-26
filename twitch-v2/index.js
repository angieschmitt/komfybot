const settingsFile = require('./settings');
const settings = settingsFile.content();

const functionsFile = require('./functions/index');
const functions = functionsFile.content();

// const debugFile = require('./debug/index');
// const debug = debugFile.content();
// debug.init();

const globals = [];
globals['endpoint'] = settings.endpoint;

// Handle creating bots...
globals['bots'] = [];
globals['bots'] = functions.createBots(globals);

// Handle refreshing commands and timers...
globals['refreshHandler'] = functions.refreshHandler(globals);