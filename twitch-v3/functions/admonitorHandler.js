export async function admonitorHandler(client, reset = false) {
    const parent = this;

    const timerInterval = 60000;

    if (reset) {
        clearInterval(client.admonitorTimer);
    }

    if (client.settings.admonitor.enabled){

        if (!('adSchedule' in client)) {
            client.adSchedule = {};
            client.adSchedule.announced = false;

            // Now load in the schedule from twitch...
            client.adSchedule.twitchData = await client.apiClient.channels.getAdSchedule(client.twitchUUID);

            // Default to null, then override...
            client.adSchedule.nextAdDate = null;
            if ( client.adSchedule.twitchData.nextAdDate ){
                client.adSchedule.nextAdDate = new Date(client.adSchedule.twitchData.nextAdDate);
            }
        }

        client.admonitorTimer = setInterval(
            async function() {

                if (client.isLive) {

                    // If there is a nextAdDate...
                    if ( client.adSchedule.nextAdDate !== null ){

                        let windowCheck = isWithinXMinutes(client.adSchedule.nextAdDate, client.settings.admonitor);

                        // If it's within x minutes, shout about it and make sure it's only once...
                        if (windowCheck && !client.adSchedule.announced){
                            client.adSchedule.announced = true;

                            if (client.settings.admonitor['warning']) {
                                let warning = client.settings.admonitor['warning'];
                                warning = warning.replace('{@warning}', client.settings.admonitor + (client.settings.admonitor > 1 ? ' minutes' : ' minute'));
                                parent.sayHandler(client, warning);
                            }
                        }

                        // If it's been announced, and NOT within x minutes, we update the data...
                        else if (!windowCheck && client.adSchedule.announced){

                            // Load in the schedule from twitch...
                            client.adSchedule.twitchData = await client.apiClient.channels.getAdSchedule(client.twitchUUID);

                            // Default to null, then override...
                            client.adSchedule.nextAdDate = null;
                            if ( client.adSchedule.twitchData.nextAdDate ){
                                client.adSchedule.nextAdDate = new Date(client.adSchedule.twitchData.nextAdDate);
                            }

                            // Reset the announced state...
                            client.adSchedule.announced = false;

                            console.log('adSchedule refreshed.');
                            console.log(client.adSchedule.nextAdDate.toLocaleString('en-US', { timeZone: "America/New_York" }));
                        }

                    }

                }

            },
            timerInterval,
        );

    }
    
};

function isWithinXMinutes(targetDate, time) {
    const now = new Date(Date.now());
    const target = new Date(targetDate);
    const targetTime = target.getTime();

    // console.log('Now: ' + now.toLocaleString('en-US', { timeZone: "America/New_York" }));
    // console.log('When: ' + target.toLocaleString('en-US', { timeZone: "America/New_York" }));

    const difference = targetTime - now;
    const diffInMs = time * 60 * 1000;

    // console.log('Diff: ' + difference);
    // console.log('DiffMs: ' + diffInMs);
    // console.log('- - -');

    // True if the date is in the future, but less than or equal to 5 minutes away
    return difference > 0 && difference <= diffInMs;
}