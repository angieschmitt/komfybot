import { Events } from 'discord.js';

export function data(){
    return {
        name: Events.MessageReactionRemove,
        once: false
    }
}

export async function execute(client, reaction, user){
    return true;
}