import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'coins',
	help: 'Command to interact with coins. Usage: !coins <@username:optional> || Additional arguments: add, remove, give, holders, spenders',
    list: true,
    allowOffline: true,
    addon: 1,
    aliases: {}
};

export const actions = {
    default: {
        execute(args, tags, message, channel, client) {

            // Setup who we're looking up...
            let target = tags['username'];
            if (args.length > 1 && args[1] !== tags.username) {
                target = args[1].replace('@', '');
            }

            const viewer = tags['username'];

            let content = '';
            axios.get(client.endpoint + 'coins/retrieve/' + client.userID + '/' + target)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        // Format based on target...
                        if (viewer == target) {
                            content = `Hey @${viewer}, you have ${resData.response} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} in your wallet.`;
                        }
                        else {
                            content = `Hey @${viewer}, ${target} has ${resData.response} ${((resData.response > 1 || resData.response == 0) ? client.settings.currency.name.plural : client.settings.currency.name.single)} in their wallet.`;
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
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
    add: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 2, 3 ],
            error: 'don\'t forgot the user and the amount!',
        },
        execute(args, tags, message, channel, client) {

            const target = args[2].replace('@', '');
            const amount = args[3];
            if (!functions.isInt(amount)) {
                content = 'The amount goes after the username';
                functions.sayHandler(client, content);
                return;
            }

            let reason = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();
            reason = encodeURIComponent(reason);

            let content = '';
            axios.get(client.endpoint + 'coins/insert/' + client.userID + '/' + target + '/' + amount + '/' + reason)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content = `Congrats @${target} on adding ${amount} ${(amount > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to your wallet.`;
                        content += ` You have a total of ${resData.response} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
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
    remove: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 2, 3 ],
            error: 'don\'t forgot the user and the amount!',
        },
        execute(args, tags, message, channel, client) {

            const target = args[2].replace('@', '');
            const amount = Math.abs(args[3]) * -1;
            if (!functions.isInt(amount)) {
                content = 'The amount goes after the username';
                functions.sayHandler(client, content);
                return;
            }

            let reason = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').replace(args[2], '').replace(args[3], '').trim();
            reason = encodeURIComponent(reason);

            let content = '';
            axios.get(client.endpoint + 'coins/insert/' + client.userID + '/' + target + '/' + amount + '/' + reason)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content = `Congrats @${target} on adding ${amount} ${(amount > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to your wallet.`;
                        content += ` You have a total of ${resData.response} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
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
    give: {
        args: {
            required: [ 2, 3 ],
            error: 'don\'t forgot the user and the amount!',
        },
        execute(args, tags, message, channel, client) {

            const viewer = tags['username'];
            const viewerID = tags['user-id'];
            const target = args[2].replace('@', '');
            const amount = args[3];
            if (!functions.isInt(amount)) {
                content = 'The amount goes after the username';
                functions.sayHandler(client, content);
                return;
            }

            let content = '';
            axios.get(client.endpoint + 'coins/give/' + client.userID + '/' + viewerID + '/' + target + '/' + amount + '/')
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        content = `Transfer complete: @${viewer} gave @${target} ${amount} ${(amount > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)}.`;
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'not_enough_coins') {
                            content = `It looks like you don't have ${amount} ${(resData.response > 1 ? client.settings.currency.name.plural : client.settings.currency.name.single)} to give.`;
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
    holders: {
        execute(args, tags, message, channel, client) {

            let content = '';
            axios.get(client.endpoint + 'coins/top/' + client.userID + '/holding')
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        if (Object.keys(resData.response).length) {
                            content += 'Top Coin Holders: ';
                            Object.entries(resData.response).forEach(([key, details]) => { // eslint-disable-line no-unused-vars
                                content += `${details['twitchUsername']} :: ${details['total']} || `;
                            });
                            content = content.substring(0, content.length - 4);
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            // data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Authorization issue');
                        }
                        else {
                            // data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Failed response');
                        }
                    }
                    else {
                        // data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    // data.errorMsg.handle(channel, client, 'leaderboard-hoarders', 'Issue while handling command');
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
        },
    },
    spenders: {
        execute(args, tags, message, channel, client) {

            let content = '';
            axios.get(client.endpoint + 'coins/top/' + client.userID + '/spending')
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        if (Object.keys(resData.response).length) {
                            content += 'Top Coin Spenders: ';
                            Object.entries(resData.response).forEach(([key, details]) => { // eslint-disable-line no-unused-vars
                                content += `${details['twitchUsername']} :: ${parseInt(details['total']) * -1} || `;
                            });
                            content = content.substring(0, content.length - 4);
                        }
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            // data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Authorization issue');
                        }
                        else {
                            // data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Failed response');
                        }
                    }
                    else {
                        // data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    // data.errorMsg.handle(channel, client, 'leaderboard-spenders', 'Issue while handling command');
                })
                .finally(function() {
                    functions.sayHandler(client, content);
                });
        },
    },
};