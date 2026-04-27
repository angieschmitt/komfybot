import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'birthday',
    help: 'Command to handle Kiwi\'s birthday needs',
    list: false,
    allowOffline: true,
    channel: ['2'],
    aliases: {
        'bdayhats': {
			arg: 'hats',
			list: false,
		},
    }
};

export const actions = {
    default: {
        say: 'Birthday commands!',
    },
    hats: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        args: {
            required: [ 1 ],
            error: 'don\'t forgot the user!',
        },
        execute(args, tags, message, channel, client) {

            const hats = [
                'Chicken Mask',
                'Party Hat - Blue',
                'Party Hat - Green',
                'Party Hat - Red',
            ];

            let hatList = '';
            // eslint-disable-next-line no-unused-vars
            Object.entries(hats).forEach(([key, hat]) => {
                hatList += hat + ', ';
                const args2 = ['!store', 'give', args[2], hat ];
                const message2 = `!store give ${args[2]} ${hat}`;
                tags['silent'] = true;
                client.commands.global.store.actions.give.execute(args2, tags, message2, channel, client);
            });

            // Remove the last ', ' ...
            hatList = hatList.substring(0, hatList.length-2);

            functions.sayHandler(client, `Handed out the birthday hats to ${args[2]}! Enjoy the following hats: ${hatList}`);
        },
    },
};

const randomProperty = function(obj) {
	const keys = Object.keys(obj);
	return keys[ keys.length * Math.random() << 0];
};