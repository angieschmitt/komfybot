// REDEEM: VIP - Level 3
// USER: komfyKiwi

import axios from 'axios';

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);

import functionsFunc from '../functions/index.js';
const functions = functionsFunc();

export default function(redeemData, client) {

    let content = '';
    axios.get(client.endpoint + 'data/vip/' + client.userID + '/add/' + redeemData.userName + '/3')
        .then(function(response) {
            const resData = response.data;

            if (resData.status === 'success') {
                content = `@${redeemData.userName} - Welcome to the VIP Lounge. Grab a blankie and some cookies!`;
                
                // Actually give them VIP
                client.apiClient.channels.addVip(client.twitchUUID, redeemData.userId)
                    .then(function(response) {
                        const resData = response.data;
                        console.log(resData);
                    })
                    .catch(function(error) {
                        if ('_body' in error){
                            const body = JSON.parse(error._body);
                            if (body.message !== 'The specified user is already a VIP of this channel.') {
                                client.debug.write(client.channel, 'vip-lvl1-default', body.message);
                            }
                        }
                    });

                // Mark it as redeemed?
                redeemData.updateStatus('FULFILLED');
            }
            else if (resData.status === 'failure') {

                if (resData.err_msg === 'already_mod') {
                    content = `@${redeemData.userName}, you are already a mod! This will break that. Stop it.`;
                }
                else if (resData.err_msg === 'already_vip') {
                    content = `@${redeemData.userName}, you are already a vip! Check back in ${resData.remaining} ${(resData.remaining > 1 ? 'days' : 'day')}!`;
                }
                else if (resData.err_msg === 'missing_authorization') {
                    // data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
                }
                else {
                    // data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
                }

                // Mark it as canceled
                redeemData.updateStatus('CANCELED');
            }
            else {
                // data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
                redeemData.updateStatus('CANCELED');
            }
        })
        .catch(function() {
            // data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
        })
        .finally(function() {
            if (content !== '') {
                functions.sayHandler(client, content);
            }
        });

};