import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'quote',
	help: 'Command to handle quotes. Usage: !quote <quoteID:optional> || Additional args: add',
    list: true,
    allowOffline: false,
    aliases: {}
};

export const actions = {
    default: {
        execute(args, tags, message, channel, client) {

            const viewer = tags['username'];

            let content = '';
            axios.get(client.endpoint + 'data/quote/' + client.userID + (1 in args ? '/' + args[1] : ''))
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        if ('twitchUsername' in resData.response) {
                            content = `Quote #${resData.response.id}: ${resData.response.content} [@${resData.response.twitchUsername}] [${resData.response.date}]`;
                        }
                        else {
                            content = `${resData.response.content}`;
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'no_matching_quoteid') {
                            content = `@${viewer}, I couldn't locate a quote with ID: ${args[1]}`;
                        }
                        else if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'quote-default', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'quote-default', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'quote-default', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'quote-default', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
        },
    },
    add: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 1 ],
            error: 'don\'t forgot the quote!',
        },
        execute(args, tags, message, channel, client) {

            const viewer = tags['username'];

            let quote = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').trim();

            // If we have an @ reference...
            let referenceUser = false;
            if (quote.lastIndexOf('@') !== -1) {
                referenceUser = quote.substring(quote.lastIndexOf('@') + 1);
                quote = encodeURIComponent(quote.replace('@' + referenceUser, ''));
            }

            let content = '';
            axios.get(client.endpoint + 'data/quote/' + client.userID + '/add/' + quote + (referenceUser ? '/' + referenceUser : ''))
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        // If we have a note...
                        content += `Quote Added: Quote #${resData.response.id}: ${resData.response.content} [@${resData.response.twitchUsername}] [${resData.response.date}]`;
                        if ('note' in resData) {
                            content += ` || Couldn't locate @${referenceUser} in our database, quote associated with @${channel.replace('#', '')} instead.`;
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'no_matching_user') {
                            content = `@${viewer}, I couldn't locate that username`;
                        }
                        else if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'quote-add', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'quote-add', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'quote-add', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'quote-add', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
        },
    },
};