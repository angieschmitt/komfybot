import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, text, msg

export default async function(client) {

    client.chatClient = new ChatClient({ 'authProvider': client.AuthProvider, channels: [userData.username] });
    client.chatClient.connect();

    functions.eventLoader(client, chat);

    return client;
};