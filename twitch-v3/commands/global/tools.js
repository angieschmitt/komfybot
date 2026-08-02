import axios from 'axios';

import functionsFunc from '../../functions/index.js';
import e from 'express';
let functions = functionsFunc();

export const settings = {
    name: 'tools',
	help: 'Streamer tools for managing the stream. Usage: !tools || Additional arguments: reset, title, tags, game',
    list: false,
    allowOffline: true,
    aliases: {
        'reset': {
			arg: 'reset',
			list: false,
		},
        'settitle': {
			arg: 'title',
			list: false,
		},
        'settags': {
			arg: 'tags',
			list: false,
		},
        'setgame': {
			arg: 'game',
			list: false,
		},
    }
};

export const actions = {
    default: {
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this is a streamer and mod only command.',
        },
        execute(args, tags, message, channel, client) {
            return false;
        },
    },
    reset: {
        help: 'Tool for reseting certain stream data. Usage: !tools reset',
        perms: {
            levels: ['streamer'],
            error: 'this command is for the streamer only.',
        },
        execute(args, tags, message, channel, client) {
            // Local resets...
            client.data.chatters = [];

            // Database resets...
            axios.get(client.endpoint + 'data/chatters/' + client.userID + '/reset');

            functions.sayHandler(client, 'Reset complete!');
        },
    },
    title: {
        args: {
            required: [ 2 ],
            error: 'don\'t forgot the title!',
        },
        help: 'Tool for managing the stream title. Usage: !tools title <title:required> || Tip: Suggested to copy, paste, and edit',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        async execute(args, tags, message, channel, client) {

            const title = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').trim();
            await client.apiClient.channels.updateChannelInfo(client.twitchUUID, { 'title' : title });

        },
    },
    tags: {
        help: 'Tool for managing the stream tags. Usage: !tools tags <tags:required>',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        async execute(args, tags, message, channel, client) {
            
            const newTags = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').trim();
            if ( newTags !== ''){
                const newTagsArr = newTags.split(" ");
                await client.apiClient.channels.updateChannelInfo(client.twitchUUID, { 'tags' : newTagsArr });
            }
            else {
                functions.sayHandler(client, 'You must provide a list of tags.');
            }

        },
    },
    game: {
        help: 'Tool for managing the stream game. Usage: !tools game <game-name:required> || Tip: Be specific',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        async execute(args, tags, message, channel, client) {
            
            const game = message.substr(message.indexOf('!')).replace(args[0], '').replace(args[1], '').trim();
            
            if ( game !== ''){
                const gameMatch = await client.apiClient.games.getGameByName(game);
                if (gameMatch !== null){
                    await client.apiClient.channels.updateChannelInfo(client.twitchUUID, { 'gameId' : gameMatch.id });
                    functions.sayHandler(client, 'Updated game to "' + gameMatch.name + '"');
                }
                else {
                    functions.sayHandler(client, 'Couldn\'t locate a game called "' + game + '"');
                }
            }
            else {
                functions.sayHandler(client, 'You must provide a game.');
            }

        },
    },
};