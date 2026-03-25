import { Events, ActivityType } from 'discord.js';

export function data(){
    return {
        name: Events.ClientReady,
        once: true
    }
}

export async function execute(client){
    console.log(`Ready! Logged in as ${client.bot.user.tag}`);

    client.bot.user.setActivity('activity', { type: ActivityType.Listening });
    client.bot.user.setPresence({
        activities: [ { name: (Math.random().toString().substring(0, 6)) + ' - He//l{:P} <v>EEEE', type: ActivityType.Listening } ],
        status: 'online',
    });

    setInterval((client) => {
        client.bot.user.setPresence({
            activities: [ { name: (Math.random().toString().substring(0, 6)) + ' - He//l{:P} <v>EEEE', type: ActivityType.Listening } ],
            status: 'online',
        });
    }, 10000, client);

};