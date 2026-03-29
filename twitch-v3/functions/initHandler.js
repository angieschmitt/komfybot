import axios from 'axios';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { EventSubWsListener } from '@twurple/eventsub-ws';

export async function createBots(globals) {
	const parent = this;
	const channels = await parent.retrieveBotUsers(globals);

	const bots = {};
	Object.entries(channels).forEach(async ([uuid, results]) => { // eslint-disable-line no-unused-vars
        bots[ channels[uuid]['userID'] ] = await parent.createBot(globals, uuid, channels[uuid]);
	});

	return new Promise((resolve, reject) => {
		resolve(bots);
		reject(false);
	});
};

export async function createBot(globals, twitchUUID, userData) {
    const parent = this;

    const botDataJson = JSON.parse(userData['botData'], 'utf-8');
    const clientId = botDataJson.clientID;
    const clientSecret = botDataJson.clientSecret;

    // Assign data to the bot container...
    globals['bots'][ userData.userID ] = [];

    // Now assign it to client, cause that's what we call this container...
    let client = globals['bots'][ userData.userID ];

    // Slap the connection data in there..
    client.clientID = botDataJson.clientID;
    client.clientSecret = botDataJson.clientSecret;

    // Token data holders...
    client.appUserID = botDataJson.appUserID;
    client.appToken = botDataJson.appToken;
    client.appRefresh = botDataJson.appRefresh;
    client.appRefreshTime = getRefreshTime(botDataJson.appLastUpdate, botDataJson.appExpires);
    client.botUserID = botDataJson.botUserID;
    client.botToken = botDataJson.botToken;
    client.botRefresh = botDataJson.botRefresh;
    client.botRefreshTime = getRefreshTime(botDataJson.botLastUpdate, botDataJson.botExpires);

    // Assign some extra stuff...
    client.userID = userData.userID;
    client.twitchUUID = twitchUUID;
    client.channel = '#' + userData.username;
    client.endpoint = globals.endpoint;
    client.socketInfo = globals.websocket;

    // bot information...
    client.botName = botDataJson.botUsername;

    // Silly extras...
    client.launch = new Date();

    // Interval and Timeouts containers...
    client.intervals = {
    	// to keep a reference to all the intervals
    	intervals : new Array,

    	// create another interval
    	make(...args) {
    		const id = args.shift();
    		const newInterval = setInterval(...args);
    		this.intervals[id] = newInterval;
    		return newInterval;
    	},

    	// clear a single interval
    	clear(id) {
    		delete this.intervals.id;
    		return clearInterval(this.intervals[id]);
    	},

    	// clear all timeouts
    	clearAll() {
    		Object.entries(this.intervals).forEach(([idx]) => {
    			this.clear(idx);
    		});
    	},
    };
    client.timeouts = {
    	// to keep a reference to all the timeouts
    	timeouts : new Array,

    	// create another timeouts
    	make(...args) {
    		const id = args.shift();
    		const newTimeout = setTimeout(...args);
    		this.timeouts[id] = newTimeout;
    		return newTimeout;
    	},

    	// clear a single timeouts
    	clear(id) {
    		delete this.timeouts.id;
    		return clearTimeout(this.timeouts[id]);
    	},

    	// clear all timeouts
    	clearAll() {
    		Object.entries(this.timeouts).forEach(([idx]) => {
    			this.clear(idx);
    		});
    	},
    };

    // Setup the debug logging...
    await parent.debugLoader(client);
    client.debug.write = ((...args) => {
        parent.debugLog(client.debug, ...args);
    });

    // Connect to our websocket...
    parent.websocketCreate(client);

    // Setup the botAuthProvider...
    client.AuthProvider = new RefreshingAuthProvider({ 'clientId': client.clientID, 'clientSecret': client.clientSecret });
    await client.AuthProvider.addUserForToken({ "accessToken": client.appToken, "refreshToken": client.appRefresh, "expiresIn": 0, "obtainmentTimestamp": 0 } );
    await client.AuthProvider.addUserForToken({ "accessToken": client.botToken, "refreshToken": client.botRefresh, "expiresIn": 0, "obtainmentTimestamp": 0 }, ['chat'] );

    // Force refresh on startup...
    client.AuthProvider.refreshAccessTokenForUser(client.appUserID);
    client.AuthProvider.refreshAccessTokenForUser(client.botUserID);

    // onRefresh, do stuff...
    client.AuthProvider.onRefresh(async (userID, tknData) => {

        const date = new Date(tknData.obtainmentTimestamp);
        const refreshDate = new Date(date.setUTCSeconds(date.getUTCSeconds() + tknData.expiresIn));
        
        if (userID == client.appUserID){
            console.log(`${client.channel} : appToken : Update : ${date.toLocaleString('en-US', { timeZone: "America/New_York" })}`);

            client.appToken = tknData.accessToken;
            client.appRefresh = tknData.refreshToken;
            client.appRefreshTime = refreshDate;
            axios.get(`${globals['endpoint']}token/insert/${client.userID}/app/${tknData.accessToken}/${tknData.refreshToken}/${tknData.expiresIn}`);

            client.timeouts.make(
                'appTokenUpdater',
                () => {
                    client.AuthProvider.refreshAccessTokenForUser(client.appUserID);
                    client.timeouts.clear('appTokenUpdater');
                },
                ((tknData.expiresIn - 5) * 1000),
            );
        }
        else if (userID == client.botUserID){
            console.log(`${client.channel} : botToken : Update : ${date.toLocaleString('en-US', { timeZone: "America/New_York" })}`);
            client.botToken = tknData.accessToken;
            client.botRefresh = tknData.refreshToken;
            client.botRefreshTime = refreshDate;
            axios.get(`${globals['endpoint']}token/insert/${client.userID}/bot/${tknData.accessToken}/${tknData.refreshToken}/${tknData.expiresIn}`);

            // Not needed for this one, apparently...
            // client.timeouts.make(
            //     'botTokenUpdater',
            //     () => {
            //         client.AuthProvider.refreshAccessTokenForUser(client.botUserID);
            //         client.timeouts.clear('botTokenUpdater');
            //     },
            //     ((tknData.expiresIn - 5) * 1000),
            // );
        }

    });
    
    // Create the ChatClient...
    client.chatClient = new ChatClient({ 'authProvider': client.AuthProvider, channels: [userData.username] });
    client.chatClient.connect();        

    // Create the EventSub listener...
    client.apiClient = new ApiClient({ 'authProvider': client.AuthProvider });
    client.eventsubListener = new EventSubWsListener({ 'apiClient': client.apiClient });
    client.eventsubListener.start();

    // Assign the subscriptions...
    parent.eventLoader(client);

    // Load in more data...
    await parent.dataLive(client);
    await parent.dashboardLoader(client);
    await parent.dataChaosWords(client);
    await parent.timerHandler(client);

    return globals;
};

export async function retrieveBotUsers(globals) {
    try {
        const response = await axios.get(globals['endpoint'] + 'token/retrieve/all');
        const json = response.data;

        if (json !== undefined) {
            return json.response;
        }
    }
    catch (error) {
        console.log(error);
    }
};

export function getRefreshTime(time, offset){

    const date = new Date(time);
    const refreshDate = new Date(date.setUTCSeconds(date.getUTCSeconds() + offset));

    return refreshDate;
}