export async function reactwordLocator(text, msg, client) {
    const parent = this;

    const userID = msg.userInfo.userId;
    const words = client.reactwords;

    const output = {};
    // Check user specific first
    if (userID in words) {
        Object.entries(words[userID]).forEach(([match, response]) => {
            if (text.includes(match)) {
                output[match] = response.replace('<@username>', '@' + msg.userInfo.userName);
            }
            else if (text.toLowerCase().includes(match.toLowerCase())) {
                output[match] = response.replace('<@username>', '@' + msg.userInfo.userName);
            }
        });
    }

    // If no user specific, check globals
    if (0 in words) {
        Object.entries(words[0]).forEach(([match, response]) => {
            if (text.includes(match)) {
                output[match] = response.replace('<@username>', '@' + msg.userInfo.userName);
            }
            else if (text.toLowerCase().includes(match.toLowerCase())) {
                output[match] = response.replace('<@username>', '@' + msg.userInfo.userName);
            }
        });
    }

    // If output, return.. if not false
    if (Object.keys(output).length) {
        return output;
    }
    return false;

}