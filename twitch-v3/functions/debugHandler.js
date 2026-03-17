import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import util from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function debugLoader(client){

    if (!('debug' in client)) {
        client.debug = new Array;
    }

    // Setup the folder and create it if it doesn't exists...
    client.debug.folder = path.join(__dirname, '../debug/') + client.twitchUUID;
    if (!fs.existsSync(client.debug.folder)) {
        fs.mkdirSync(client.debug.folder);
    }

}

export function debugLog(debug, channel, event, comment = null) {

    // Now set up the file...
    let today = new Date().toISOString().split('T')[0];
    let file = debug.folder + '/' + today + '.csv';
    debug.stream = fs.createWriteStream(file, { flags: 'a' });

    // Create the entry...
    const now = new Date().toLocaleString('sv-SE', { timeZone: 'America/New_York' }).replace(' ', '_');
    if (typeof debug.stream.write === 'function') {
        debug.stream.write(now + ',' + util.format(channel) + ',' + util.format(event) + ',' + util.format(comment) + '\n');
    }
    
};