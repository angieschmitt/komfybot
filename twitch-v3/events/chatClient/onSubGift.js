import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, subInfo, msg

export default async function(channel, user, subInfo, msg, client) {

    // If not anonymous...
    if (subInfo.gifter !== undefined){

        if (client.events['subgift']) {

            let content = client.events['subgift'];
            content = content.replace('{@user}', subInfo.gifterDisplayName);
            content = content.replace('{@recipient}', subInfo.displayName);
            content = content.replace('{@months}', subInfo.streak + (subInfo.streak > 1 ? ' months' : ' month'));

            functions.sayHandler(client, content);
        }

    }
    // If is anonymous...
    else {

        if (client.events['anonsubgift']) {

			let content = client.events['anonsubgift'];
			content = content.replace('{@recipient}', subInfo.displayName);
            content = content.replace('{@months}', subInfo.streak + (subInfo.streak > 1 ? ' months' : ' month'));

			functions.sayHandler(client, content);
		}

    }
    
};