// REDEEM: Bird Magic
// USER: kittenAngie

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);

export default function(redeemData, client) {
    client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : path.basename(__filename, '.js'), 'redemptionID': redeemData.id, 'content' : redeemData.input, 'target': 'bird-magic:' + client.userID }, 'source': 'komfybot' }));
};