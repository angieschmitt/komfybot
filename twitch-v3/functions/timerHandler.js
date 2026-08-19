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
        // Updated via onStreamOnline and dataLive called in initHandler
        client.timerOffset = 1;
    }

    if (!('adSchedule' in client)) {
        client.adSchedule = await client.apiClient.channels.getAdSchedule(client.twitchUUID);
        client.adSchedule.nextAdDateObj = new Date(client.adSchedule.nextAdDate);
        client.adSchedule.warning = 1;
        client.adSchedule.announced = false;
    }

    // Now load in the timerOffsets
    if ('timerOffset' in client) {

        client.timerCount = setInterval(
            async function() {

                // Handle user created timers..
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

                // Handle ad notification timer, if enabled...
                // TODO: Add ability to toggle ad warnings
                // TODO: Add ability to set custom time for warning to dashboard
                // TODO: Add custom ad warning message to dashboard
                if (client.isLive) {

                    // If there is a nextAdDate...
                    if ( client.adSchedule.nextAdDate !== null ){

                        let windowCheck = isWithinXMinutes(client.adSchedule.nextAdDateObj, client.adSchedule.warning);

                        console.log('Announced: ' + client.adSchedule.announced);
                        console.log('- - -');

                        // If it's within x minutes, shout about it and make sure it's only once...
                        if (windowCheck && !client.adSchedule.announced){
                            client.adSchedule.announced = true;
                            parent.sayHandler(client, `Ad coming up in about the next ${client.adSchedule.warning} ${(client.adSchedule.warning > 1 ? 'minutes' : 'minute')}!`);
                        }

                        // If it's been announced, and NOT within x minutes, we update the data...
                        else if (!windowCheck && client.adSchedule.announced){
                            client.adSchedule = await client.apiClient.channels.getAdSchedule(client.twitchUUID);
                            client.adSchedule.nextAdDateObj = new Date(client.adSchedule.nextAdDate);
                            client.adSchedule.announced = false;

                            console.log('adSchedule refreshed.');
                            console.log(nextAdDateObj.toLocaleString('en-US', { timeZone: "America/New_York" }));
                        }

                    }

                }

                client.timerOffset++;
            },
            timerInterval,
        );

    }
};

function isWithinXMinutes(targetDate, time) {
    const now = new Date(Date.now());
    const target = new Date(targetDate);
    const targetTime = target.getTime();

    console.log('Now: ' + now.toLocaleString('en-US', { timeZone: "America/New_York" }));
    console.log('When: ' + target.toLocaleString('en-US', { timeZone: "America/New_York" }));

    const difference = targetTime - now;
    const diffInMs = time * 60 * 1000;

    console.log('Diff: ' + difference);
    console.log('DiffMs: ' + diffInMs);

    // True if the date is in the future, but less than or equal to 5 minutes away
    return difference > 0 && difference <= diffInMs;
}