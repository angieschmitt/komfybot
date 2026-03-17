import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, raidInfo, msg

export default async function(channel, user, raidInfo, msg, client) {

    if (client.events['raided']) {
        this.getLastPlayed(user, client).then((data) => {
            let content = client.events['raided'];
            content = content.replace('{@user}', '@' + raidInfo.displayName);
            content = content.replace('{@viewers}', raidInfo.viewerCount + (raidInfo.viewerCount > 1 ? ' viewers' : ' viewer'));
            if ( data.latest !== '' ){
                content = content.replace('{@lastplayed}', data.latest);
            }
            else {
                content = content.replace('{@lastplayed}', 'something');
            }

            functions.sayHandler(client, content);
        });
    }
    
};

export async function getLastPlayed(username, client) {
    const output = await axios.get(client.endpoint + 'shoutout/insert/' + username)
        .then(function(response) {
            if (response.data.status == 'success') {
                return response.data.response;
            }
            else {
                return false;
            }
        })
        .catch(() => {
            return false;
        });
    return output;
};