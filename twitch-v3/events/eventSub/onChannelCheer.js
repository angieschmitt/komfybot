// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelCheerEvent.html

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export default async function(event, client) {

    if (client.events['cheer']) {
        let content = client.events['cheer'];
        content = content.replace('{@user}', '@' + event.userDisplayName);
        content = content.replace('{@amount}', event.bits + (event.bits > 1 ? ' bits' : ' bit'));

        functions.sayHandler(client, content);
    }

    // console.log('caught cheer');
    // console.log(channel);
    // console.log(tags);
    // console.log(message);

};