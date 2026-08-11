// https://twurple.js.org/reference/eventsub-ws/classes/EventSubWsListener.html#onChannelAdBreakBegin
// https://twurple.js.org/reference/eventsub-base/classes/EventSubChannelAdBreakBeginEvent.html

import e from 'express';
import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export function settings(client) {
    return [
        client.twitchUUID,
    ];
}

export async function action(event, client) {

    // TODO: Add custom ad messages to dashboard

    let content = '';
    if (event.isAutomatic){
        content = `Time for a scheduled ad break! See you in about ${ fancyTimeFormat(event.durationSeconds) }!`;
    }
    else {
        content = `We're taking an unscheduled ad break! See you in about ${ fancyTimeFormat(event.durationSeconds) }!`;
    }

    if (content !== '') {
        // force the schedule to update...
        client.adSchedule = await client.apiClient.channels.getAdSchedule(client.twitchUUID);

        // Now say the ad message...
        functions.sayHandler(client, content);
    }

};

function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    let hrsOut = ( hrs > 0 ? hrs + " hours" : false );
    let mnsOut = ( mins > 0 ? mins + ( mins > 1 ? " mins" : ' min' ) : false );
    let scsOut = ( secs > 0 ? secs + ( secs > 1 ? " secs" : ' sec' ) : false );

    if (hrsOut) { ret += hrsOut; }
    if (hrsOut && mnsOut){ ret += ', ' + mnsOut; } else if (mnsOut) { ret += mnsOut; }
    if (mnsOut && scsOut){ ret += ' and ' + scsOut; } else if (scsOut) { ret += scsOut; }

    return ret;
}