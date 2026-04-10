import ws from 'ws';

export async function websocketCreate(client){
    const parent = this;

    const identifier = 'komfybot:' + client.userID;
    const websocket = new ws('wss://' + client.socketInfo.ip + ':' + client.socketInfo.port + '/' + identifier, { rejectUnauthorized: false });

    websocket.onopen = () => {
        websocket.send(JSON.stringify({ 'action': 'refresh', 'data': { 'target': 'all' }, 'source': identifier }));
        client.timeouts.clear('websocketRetry');
    };

    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Setup targets for checking against...
        const targets = [];
        if (typeof data.target === 'object') {
            data.target.forEach(element => {
                let iter = 0;
                Object.entries(data.userList).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
                    if (iter == element) {
                        targets.push(idx);
                    }
                    iter++;
                });
            });
        }

        if (targets.includes('komfybot:' + client.userID)) {
            if (data.action === 'ping') {
                if ('refresh' in data.data) {
                    parent.dashboardLoader(client, data.data.refresh, true);
                }
                else {
                    const content = 'Beep Boop';
                    parent.sayHandler(client, content);
                }
            }
            else if (data.action === 'speak') {
                const content = data['data']['message'];
                parent.sayHandler(client, content);
            }
            else if (data.action === 'redeem') {
                client.redeems[data.data.redeemID].output(data, client);
            }
        }
    };

    websocket.onerror = (error) => {
        console.log(error.message);
    };

    websocket.onclose = () => {
        client.timeouts.clear('websocketRetry');
        client.timeouts.make(
            'websocketRetry',
            (client) => { parent.websocketCreate(client); },
            1000,
            client,
        );
    };

    client.intervals.clear('websocketLiveCheck');
    client.intervals.make(
        'websocketLiveCheck',
        () => {
            if (websocket.readyState != 0) {
                websocket.send(JSON.stringify({ 'action': 'live-check', 'data': { 'timestamp': new Date().toISOString() }, 'source': identifier }));
            }
        },
        10000,
    );

    client.websocket = websocket;

    // Debug log..
    // client.debug.write(client.channel, 'WEBSOCKET_CONNECTED');
}