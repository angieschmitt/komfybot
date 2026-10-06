import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, gifterName, giftInfo

export default async function(channel, user, giftInfo, msg, client) {

    // If we have custom output...
    if (client.events['communitysub']) {

        // Set the container value to prevent duplicates with onSubGift
        const previousGiftCount = client.giftCounts.get(user) ?? 0;
	    client.giftCounts.set(user, previousGiftCount + giftInfo.count);

        // Load the output and format...
        let content = client.events['communitysub'];
        content = content.replace('{@user}', '@' + user);
        content = content.replace('{@amount}', giftInfo.count + (giftInfo.count > 1 ? ' subs' : ' sub'));
    
        // Now say it...
        functions.sayHandler(client, content);
    }
    
};