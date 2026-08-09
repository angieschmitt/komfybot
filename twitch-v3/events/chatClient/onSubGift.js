import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, user, subInfo, msg

export default async function(channel, user, subInfo, msg, client) {

    // Check if this is part of a mass gift...
    const gifterName = subInfo.gifter;
	const previousGiftCount = client.giftCounts.get(gifterName) ?? 0;

    // If there is exisiting gift data...
	if (previousGiftCount > 0) {
        // Reduce each time until we hit zero...
		client.giftCounts.set(user, previousGiftCount - 1);
	}

    // If there isn't, handle it like a single gift...
    else {
        
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

    }
    
};