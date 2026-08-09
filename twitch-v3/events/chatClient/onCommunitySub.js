import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

// channel, gifterName, giftInfo

export default async function(channel, user, giftInfo, msg, client) {

    const previousGiftCount = client.giftCounts.get(user) ?? 0;
	client.giftCounts.set(user, previousGiftCount + giftInfo.count);
	let content = `Thanks ${user} for gifting ${giftInfo.count} subs to the community!`;

    functions.sayHandler(client, content);
    
};