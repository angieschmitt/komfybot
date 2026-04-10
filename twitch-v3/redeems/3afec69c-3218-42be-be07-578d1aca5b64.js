// REDEEM: Background Swapper
// USER: kittenangie

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);

import functionsFunc from '../functions/index.js';
const functions = functionsFunc();

export function input(redeemData, client) {
    client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : path.basename(__filename, '.js'), 'redemptionID': redeemData.id, 'content' : redeemData.input, 'target': 'bgswap:' + client.userID, 'userID': client.userID }, 'source': 'komfybot' }));
};

export function output(data, client) {
    functions.sayHandler(client, data.data.message);
}