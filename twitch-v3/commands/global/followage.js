import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'followage',
	help: 'Command to retrieve users followage. Usage: !followage',
    list: false,
    allowOffline: true,
    aliases: {}
};

export const actions = {
    default: {
        help: 'Checkin to the stream. !checkin',
        execute(args, tags, message, channel, client) {
            // Get channel and userID
            const streamer = channel.replace('#', '');
            const viewer = tags['username'];
            const viewerID = tags['user-id'];

            let content = '';
            axios.get(client.endpoint + 'data/followage/' + client.userID + '/' + viewerID)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        if ('twitch_date' in resData.response && 'bot_date' in resData.response) {
                            content += `Hey @${viewer}, according to Twitch, you've been following ${streamer} for ${resData.response['twitch_date']}! `;
                            content += `According to me, you've been here for ${resData.response['bot_date']}!`;
                        }
                        else {
                            if ('twitch_date' in resData.response) {
                                content += `Hey @${viewer}, according to Twitch, you've been following ${streamer} for ${resData.response['twitch_date']}!`;
                            }
                            if ('bot_date' in resData.response) {
                                content += `Hey @${viewer}, according to me, you've been following ${streamer} for ${resData.response['bot_date']}!`;
                            }
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'followage-default', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'followage-default', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'followage-default', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'followage-default', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
        },
    },
};