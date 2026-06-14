export async function reactwordLocator(event, client) {
    const parent = this;

    const userID = event.chatterId;
    const words = client.reactwords;

    const output = {};
    // Check user specific first
    if (userID in words) {
        Object.entries(words[userID]).forEach(([match, response]) => {
            if (event.messageText.includes(match)) {
                output[match] = response.replace('<@username>', '@' + event.chatterName);
            }
            else if (event.messageText.toLowerCase().includes(match.toLowerCase())) {
                output[match] = response.replace('<@username>', '@' + event.chatterName);
            }
        });
    }

    // If no user specific, check globals
    if (0 in words) {
        Object.entries(words[0]).forEach(([match, response]) => {
            if (event.messageText.includes(match)) {
                output[match] = response.replace('<@username>', '@' + event.chatterName);
            }
            else if (event.messageText.toLowerCase().includes(match.toLowerCase())) {
                output[match] = response.replace('<@username>', '@' + event.chatterName);
            }
        });
    }

    // If output, return.. if not false
    if (Object.keys(output).length) {
        return output;
    }
    return false;

}