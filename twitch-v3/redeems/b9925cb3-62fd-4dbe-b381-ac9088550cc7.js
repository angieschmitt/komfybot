// REDEEM: Get KomfyCoins
// USER: KomfyKiwi

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);

import functionsFunc from '../functions/index.js';
const functions = functionsFunc();

export default function(redeemData, client) {
    const args2 = ['!coins', 'add', redeemData.userName, 160, 'Coin Conversion' ];
    const message2 = `!coins add ${redeemData.userName} 160 Coin Conversion`;
    client.commands.global.coins.actions.add.execute(args2, { 'silent': true }, message2, client.channel, client);

    const content = 'Redeem processed!';
    functions.sayHandler(client, content);

    // Mark it as redeemed?
    redeemData.updateStatus('FULFILLED');
};