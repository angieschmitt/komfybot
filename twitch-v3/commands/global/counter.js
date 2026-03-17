import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'counter',
    help: 'Command to count something. Usage: !count || Additional arguments: set, reset',
    list: false,
    allowOffline: false,
    aliases: {
        'count': {
			arg: false,
			list: true,
		},
    }
};

export const actions = {
    default: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        execute(args, tags, message, channel, client) {
            let content = '';
            axios.get(client.endpoint + 'data/counter/' + client.userID)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content += `COUNTER: ${resData.response}`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'counter-default', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'counter-default', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'counter-default', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'counter-default', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });

        },
    },
    set: {
        help: 'Command to set the counter to a specific amount. Usage !counter set <amount:required>',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 2 ],
            error: 'don\'t forgot the amount!',
        },
        execute(args, tags, message, channel, client) {
            let content = '';
            axios.get(client.endpoint + 'data/counter/' + client.userID + '/set/' + args[2])
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content += `COUNTER: ${resData.response}`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'counter-set', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'counter-set', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'counter-set', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'counter-set', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });

        },
    },
    reset: {
        help: 'Command to reset the counter. Usage !counter reset',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        execute(args, tags, message, channel, client) {
            let content = '';
            axios.get(client.endpoint + 'data/counter/' + client.userID + '/reset')
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content += `COUNTER: ${resData.response}`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'counter-reset', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'counter-reset', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'counter-reset', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'counter-reset', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });

        },
    },
};