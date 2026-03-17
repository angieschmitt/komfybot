import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, subInfo, msg

export default async function(channel, user, subInfo, msg, client) {

    if (client.events['sub']) {
        let content = client.events['sub'];
        content = content.replace('{@user}', subInfo.displayName);

        functions.sayHandler(client, content);
    }
    
};