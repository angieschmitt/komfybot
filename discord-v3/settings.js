export default function(){
    return {
        env: 'live',
        endpoint: 'https://api.komfybot.com/v2/endpoint/',
        socket: {
            live : {
                'ip' : '64.176.216.41',
                'port' : '9090',
            },
            dev : {
                'ip' : '127.0.0.1',
                'port' : '1165',
            },
        },
        userID: 2,
	    botID: 1045127424347750401, // eslint-disable-line no-loss-of-precision
        twitchClientID: 'chycppy4q6vqkrgtbudpvbv6mke8nn',
    }
}