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
    forcechaos: {
        perms: {
            levels: ['admin'],
            error: 'this command is for admins only.',
        },
        execute(args, tags, message, channel, client) {

            if ('chaos-mode' in client.overlay) {
                if ('data' in client.overlay['chaos-mode']) {
                    let content = 'Chaos mode word list: ';
                    Object.entries(client.data.chaosMode).forEach(([data]) => {
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