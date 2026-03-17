import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'poop',
	help: '💩💩💩💩💩',
    list: true,
    allowOffline: false,
    channel: ['2'],
    aliases: {}
};

export const actions = {
    default: {
        execute(args, tags, message, channel, client) {

            const links = {
                'kiwi' : 'https://clips.twitch.tv/AbrasiveIncredulousFishMVGame-Zs5rxq2JhgjKgOat',
                'lycan' : 'https://clips.twitch.tv/PoliteBrainyInternVoteYea-eVSsDvIPLWCh5MKR',
                'mrdrxman' : 'https://clips.twitch.tv/DrabIncredulousChoughBibleThump-_q416OBjlz17Tdzn',
            };

            let content = '';

            let check = 0;
            // If assigned, use it
            if (args[1]) {
                if (!isNaN(parseInt(args[1]))) {
                    check = args[1];
                }
                else {
                    const keys = Object.keys(links);
                    check = keys.indexOf(args[1]);
                }
            }
            else {
                check = functions.randomInt(0, (Object.keys(links).length - 1));
            }

            content += links[ Object.keys(links)[check] ];

            functions.sayHandler(client, content);
        },
    },
};