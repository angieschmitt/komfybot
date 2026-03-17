export async function timerHandler(client, reset = false) {
    const parent = this;

    const timerInterval = 60000;
    // const timerInterval = 10000;

    if (reset) {
        clearInterval(client.timerCount);
        client.timerOffset = 1;
    }

    // If not set up, set it up
    if (!('timerOffset' in client)) {
        // TO DO: Set timer based off stream up time
        client.timerOffset = 1;
    }

    // Now load in the timerOffsets
    if ('timerOffset' in client) {

        client.timerCount = setInterval(
            function() {

                // If the user is live...
                if (client.isLive) {
                    // Enter messages into queue
                    const timerQueue = {};
                    Object.entries(client.timers).forEach(([index, data]) => {
                        if ((client.timerOffset % data['timer']) == 0) {
                            if (!Object.keys(timerQueue).length) {
                                timerQueue[ index ] = data;
                            }
                            else {
                                Object.keys(timerQueue).forEach(key => delete timerQueue[key]);
                                timerQueue[ index ] = data;
                            }
                        }
                    });

                    // If the queue has items, handle them...
                    if (Object.keys(timerQueue).length) {

                        const ident = Object.keys(timerQueue)[0];
                        const messageData = timerQueue[ident];

                        if (client.lastMessage !== messageData['message']) {
                            console.log('Timer : ' + ident + ' [' + client.channel + ', ' + client.userID + ', live, ' + messageData['timer'] + ']');

                            const content = messageData['message'];
                            parent.sayHandler(client, content);

                            Object.keys(timerQueue).forEach(key => delete timerQueue[key]);
                        }
                    }

                }

                client.timerOffset++;
            },
            timerInterval,
        );

    }
};