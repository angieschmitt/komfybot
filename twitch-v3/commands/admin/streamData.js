import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'check',
	help: 'An assortment of ascii emojis',
    list: false,
	aliases: {
	},
};

export const actions = {
    default: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        async execute(args, tags, message, channel, client) {
            let content = '';

            await functions.dataLive(client).then(() => {
                content += ' Live: ' + (client.isLive ? 'Yes' : 'No');
                functions.sayHandler(client, content);
            });
        },
    },
    chatters: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {
            let content = ' Chatters: None';
            if (client.data.chatters.length) {
                content = ' Chatters: ' + client.data.chatters.join(', ');
            }
            content = content.trim();
            functions.sayHandler(client, content);
        },
    },
    uptime: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {
            let content = '';
            const launch = new Date(client.launch);
            const newDate = functions.getTimeSince(launch);
            content += `Launched: ${launch} || Uptime: ${newDate}`;
            functions.sayHandler(client, content);
        },
    },
    timers: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {
            let content = '';
            const offset = client.timerOffset;
            content += `Current Timer: ${offset}`;
            functions.sayHandler(client, content);
        },
    },
    tokens: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {

            console.log(client.appToken + ' -> ' + client.appRefreshTime.toLocaleString('en-US', { timeZone: "America/New_York" }));
            console.log(client.botToken + ' -> ' + client.botRefreshTime.toLocaleString('en-US', { timeZone: "America/New_York" }));

            if (args[2] == 'refresh'){
                client.AuthProvider.refreshAccessTokenForUser(client.appUserID);
                client.AuthProvider.refreshAccessTokenForUser(client.botUserID);
            }
        }
    },
    walkon: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {
            
            const walkonsData = client.overlay['walk-ons'].data;
            const walkonData = walkonsData.find((developer) => developer.twitchUUID === tags['user-id']);

            if (walkonData){
                client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'content' : walkonData.mediaID, 'type' : 'walkOn', 'target': 'walk-ons:' + client.userID }, 'source': 'komfybot' }));
            }
        }
    },
    debug: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {
            client.debug.write(client.channel, 'streamdata-debug', 'Hi Boss!');
        }
    },
    forcechaos: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {

            if ('chaos-mode' in client.overlay) {
                if ('triggers' in client.overlay['chaos-mode']) {
                    let content = 'Chaos mode word list: ';
                    Object.entries(client.overlay['chaos-mode'].triggers).forEach(([data]) => {
                        content += data + ', ';
                    });
                    content = content.substring(0, content.length - 2);
                    functions.sayHandler(client, content);
                }
            }

            // Set chaosMode state...
            client.redeems.states.chaosMode = true;
            client.websocket.send(JSON.stringify({ 'action': 'ping', 'data': { 'redeemID' : 'force', 'redemptionID': 'force', 'content' : 'v', 'target': 'chaos-mode:' + client.userID }, 'source': 'komfybot' }));
            client.timeouts.make(
                'chaosMode',
                () => {
                    client.redeems.states.chaosMode = false;
                    client.timeouts.clear('chaosMode');
                },
                90000,
            );

        },
    },
};