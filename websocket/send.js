import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('Output: Sending to server');
    ws.send('Sending to server');
});

ws.on('message', function message(data) {
  console.log('Received: %s', data);
});