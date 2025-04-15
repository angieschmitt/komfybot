import { WebSocketServer } from 'ws';

function init() {
    const wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);

        ws.on('message', function message(data) {
            console.log('Received: %s', data);

            ws.send('Received on server');
        });
    });
}

init();