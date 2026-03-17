import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, text, msg

export default async function(channel, user, text, msg, client) {

    client.lastMessage = text;

    functions.messageHandler(channel, user, text, msg, client);

};