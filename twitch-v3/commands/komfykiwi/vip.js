import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'vip',
	help: 'Check your redeemed VIP status',
    list: true,
    allowOffline: true,
    channel: ['2'],
    aliases: {}
};

export const actions = {
    default: {
        execute(args, tags, message, channel, client) {

            const target = tags.username;

            let content = '';
            axios.get(client.endpoint + 'data/vip/' + client.userID + '/lookup/' + target)
                .then(function(response) {
                    const resData = response.data;

                    if (resData.status === 'success') {
                        content = `@${target}, you have ${resData.response.remaining} ${(resData.response.remaining > 1 ? 'days' : 'day')} of VIP remaining.`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'already_mod') {
                            content = `@${target}, you are already a mod. Stop it.`;
                        }
                        else if (resData.err_msg === 'no_vip_status') {
                            content = `@${target}, it looks like your VIP has run out, or you haven't redeemed it yet.`;
                        }
                        else if (resData.err_msg === 'missing_authorization') {
                            // data.errorMsg.handle(channel, client, 'checkin', 'Authorization issue');
                        }
                        else {
                            // data.errorMsg.handle(channel, client, 'checkin', 'Failed response');
                        }
                    }
                    else {
                        // data.errorMsg.handle(channel, client, 'checkin', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    // data.errorMsg.handle(channel, client, 'checkin', 'Issue while handling command');
                })
                .finally(function() {
                    if (!('silent' in tags)) {
                        if (content !== '') {
                            functions.sayHandler(client, content);
                        }
                    }
                });
            
        },
    },
};