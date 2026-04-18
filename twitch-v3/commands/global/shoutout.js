import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'shoutout',
	help: 'Command to shoutout a user in chat. Usage: !shoutout <@username:required>',
    list: true,
    allowOffline: true,
    aliases: {
        'so': {
			arg: false,
			list: false,
		},
    }
};

export const actions = {
    default: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 1 ],
            error: 'don\'t forgot the streamer!',
        },
        execute(args, tags, message, channel, client) {

            let username = '';
            if (args[1]) {
                if (args[1].indexOf('@') === 0) {
                    username = args[1].substring(1);
                }
                else {
                    username = args[1];
                }
            }
            else {
                username = tags.username;
            }

            let content = '';
            axios.get(client.endpoint + 'shoutout/insert/' + username)
                .then(function(response) {
                    const resData = response.data;
                    if (resData.status === 'success') {
                        // Start the content
                        content = `Make sure you check out @${username} over at https://www.twitch.tv/${username}`;

                        // Slap in the last game
                        if (resData.response.latest) {
                            content += `! They were last seen playing ${resData.response.latest}`;
                        }

                        // Next we work on recents
                        const recents = JSON.parse(resData.response.recent);

                        // Remove lastplayed from recent...
                        const cleanedRecents = recents.filter(function(game) {
                            return game !== resData.response.latest;
                        });

                        // If there are recents...
                        if (Object.keys(cleanedRecents).length) {

                            const items = [];

                            for (let index = 0; index < 3; index++) {
                                if (Object.keys(cleanedRecents).length) {
                                    const rand1 = functions.randomObjProperty(cleanedRecents);
                                    items.push(cleanedRecents[rand1]);
                                    cleanedRecents.splice(rand1, 1);
                                }
                            }

                            // If we have items...
                            if (items.length) {
                                // If we have more than 1, loop and add stuff..
                                if (items.length > 1) {
                                    let games = '';
                                    Object.entries(items).forEach(([key, value]) => {
                                        if (items.length > (parseInt(key) + 1)) {
                                            games += value + ', ';
                                        }
                                        else {
                                            games += ' and ' + value;
                                        }
                                    });
                                    content += ' and other games like: ' + games + '.';
                                }
                                // Otherwise slap it on the end...
                                else {
                                    content += ` and ${items[0]}.`;
                                }
                            }
                            // Otherwise, add the period...
                            else {
                                content += '.';
                            }

                        }
                        else {
                            content += '.';
                        }

                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            content = 'Authorization issue. Tell @kittenAngie.';
                        }
                        else {
                            content = 'Something went wrong, tell @kittenAngie.';
                        }
                    }
                    else {
                        content = 'Something went wrong, tell @kittenAngie.';
                    }
                })
                .catch(function() {
                    content = 'Something went wrong, tell @kittenAngie.';
                })
                .finally(function() {
                    functions.sayHandler(client, content, true);
                });
        },
    },
};