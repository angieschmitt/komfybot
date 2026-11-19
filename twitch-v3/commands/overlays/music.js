import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'music',
	help: 'Commands for the Music System. Usage: !music || Additional arguments: add, pause, skip',
    list: true,
    allowOffline: true,
    channel: [ 1 ],
    aliases: {}
};

export const actions = {
    default: {
        say: [
            'Music',
        ],
    },
    add: {
        help: 'Command to add a song to the queue. Usage: !music add <youtube-url:required>',
        execute(args, tags, message, channel, client) {

            const viewer = tags['username'];
            const viewerID = tags['user-id'];
            let content = '';
            let url = message.substr(message.indexOf(args[2])).trim();
            let videoID = extractYouTubeId(url);

            if (videoID) {
                axios.get(client.endpoint + 'overlay/music/' + client.userID + '/add/' + viewerID + '/' + videoID)
                    .then(function(response) {
                        const resData = response.data;

                        if (resData.status === 'success') {
                            const position = resData.response.length - 1;
                            content = `@${viewer} added ${resData.response[position].songData.title} to the queue.`

                            // Sync the other locations...
                            client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'action' : 'update', 'target': 'music:' + client.userID + ":default" }, 'source': 'komfybot' }));
                        }
                        else if (resData.status === 'failure') {
                            if (resData.err_msg === 'missing_authorization') {
                                client.debug.write(client.channel, 'music-add', 'Authorization issue');
                            }
                            else {
                                client.debug.write(client.channel, 'music-add', 'Failed response');
                            }
                        }
                        else {
                            client.debug.write(client.channel, 'music-add', 'Not sure how you got here');
                        }
                    })
                    .catch(function() {
                        client.debug.write(client.channel, 'music-add', 'Issue while handling command');
                    })
                    .finally(function() {
                        if (!('silent' in tags)) {
                            if (content !== '') {
                                functions.sayHandler(client, content);
                            }
                        }
                    });
            }

        }
    },
    skip: {
        help: 'Command to skip a song in the queue. Usage: !music skip',
        perms: {
            levels: ['streamer', 'mod'],
            error: 'this command is for the streamer and mods only.',
        },
        execute(args, tags, message, channel, client) {

            let content = '';

            axios.get(client.endpoint + 'overlay/music/' + client.userID + '/remove/0')
                .then(function(response) {
                    const resData = response.data;

                    if (resData.status === 'success') {
                        const removed = resData.removed;
                        content = `Skipping and removing ${removed.songData.title} from the queue.`

                        // Sync the other locations...
                        client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'action' : 'update', 'target': 'music:' + client.userID + ':default' }, 'source': 'komfybot' }));
                    }
                    else if (resData.status === 'failure') {
                        if (resData.err_msg === 'missing_authorization') {
                            client.debug.write(client.channel, 'music-add', 'Authorization issue');
                        }
                        else {
                            client.debug.write(client.channel, 'music-add', 'Failed response');
                        }
                    }
                    else {
                        client.debug.write(client.channel, 'music-add', 'Not sure how you got here');
                    }
                })
                .catch(function() {
                    client.debug.write(client.channel, 'music-add', 'Issue while handling command');
                })
                .finally(function() {
                    if (!('silent' in tags)) {
                        if (content !== '') {
                            functions.sayHandler(client, content);
                        }
                    }
                });
        }
    }
};

function extractYouTubeId(url) {
    try {
        const parsed = new URL(url);

        let videoId = false;

        if (parsed.hostname === 'youtu.be') {
            videoId = parsed.pathname.slice(1);
        }

        if (
            ['youtube.com', 'www.youtube.com',
             'm.youtube.com'].includes(parsed.hostname)
        ) {
            if (parsed.pathname === '/watch') {
                videoId = parsed.searchParams.get('v');
            }

            const match = parsed.pathname.match(
                /^\/(?:embed|shorts)\/([a-zA-Z0-9_-]+)/
            );

            if (match) videoId = match[1];
        }

        if (
            !videoId ||
            !/^[a-zA-Z0-9_-]{11}$/.test(videoId)
        ) {
            return false;
        }

        return videoId;
    } catch {
        return false;
    }
}