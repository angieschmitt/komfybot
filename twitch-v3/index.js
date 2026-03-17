import { RefreshingAuthProvider } from '@twurple/auth';
import settingsFunc from './settings.js';
import functionsFunc from './functions/index.js';

let settings = settingsFunc();
let functions = functionsFunc();

const globals = [];
globals['endpoint'] = settings.endpoint;
globals['websocket'] = settings.socket[ settings.env ];

// Create containers...
globals['bots'] = {};

// Create the bots...
functions.createBots(globals)
	.then((bots) => { globals['bots'] = bots; });