import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'clip',
	help: 'Make a quick clip of the stream. Usage: !clip',
    list: true,
    allowOffline: false,
    aliases: {}
};

export const actions = {
    default: {
        async execute(args, tags, message, channel, client) {

            const viewer = tags['username'];

            try {

                const clipData = await client.apiClient.asUser(client.botUserID, ctx => {
                    const clipData = ctx.clips.createClip({ channel: client.twitchUUID, createAfterDelay: false, duration: 30, title: `Created by ${viewer}` });
                    return clipData;
                });

                if ( clipData ){
                    functions.sayHandler(client, 'Creating clip...');
                    const clipURL = `https://www.twitch.tv/${client.channel.replace('#','')}/clip/${clipData}`;
                    const content = `@${viewer} generated a clip! Check it out at: ${clipURL}`;

                    // Timer for output...
                    client.timeouts.make(
                        'clipTimer',
                        (client, content) => {
                            functions.sayHandler(client, content);
                            client.timeouts.clear('clipTimer');
                        },
                        2500, client, content,
                    );
                }

            } catch (error) {

                let content = '';

                if ('_body' in error){
                    const body = JSON.parse(error._body);
                    if (body.message === 'Channel offline.') {
                        content = `@${viewer}, you can't clip an offline channel.`;
                    }
                }
                else {
                    content = `Something went wrong. Tell @kittenAngie.`;
                    client.debug.write(client.channel, 'clip-default', error);
                }

                functions.sayHandler(client, content);
            }
        },
    },
};