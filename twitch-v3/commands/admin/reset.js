import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'reset',
	help: 'Reset data when starting stream. Usage: !reset',
    list: false,
    allowOffline: true,
    aliases: {}
};

export const actions = {
    default: {
        perms: {
            levels: ['streamer'],
            error: 'this is a streamer only command.',
        },
        execute(args, tags, message, channel, client) {
            // Local resets...
            client.data.chatters = [];

            // Database resets...
            axios.get(client.endpoint + 'data/chatters/' + client.userID + '/reset');

            functions.sayHandler(client, 'Reset complete!');
        },
    },
};