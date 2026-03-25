import axios from 'axios';
import { Events, MessageFlags } from 'discord.js';

export function data(){
    return {
        name: Events.MessageCreate,
        once: false
    }
}

export async function execute(client, message){

    // Handle the KomfyCoin handouts
    const channel = message.channel;
    const categories = ['1045086819714347119', '1127069748157481020', '1045082408233484331', '1156573567937429514'];

    // If the message is in the appropriate categories...
    if (categories.includes(channel.parentId)) {

        // Snag the username / ID
        const userID = message.author.id;
        const username = message.author.username;

        // Skip KB messages
        if (userID === '1045127424347750401') {
            return;
        }

        // Get their lotto numbers...
        let chances = new Array();
        for (let index = 0; chances.length < 10; index++) {
            const check = client.functions.getRandomNumber(100);
            if (!chances.includes(check)) {
                chances.push(check);
            }
        }
        chances = chances.sort((a, b) => a - b);

        // Select the winning number...
        const value = client.functions.getRandomNumber(100);

        // ALWAYS - For testing reasons
        // const value = chances[0];

        // April Fools - Everybody wins (jk, lol)!
        const date = new Date();
        if (date.getMonth() == '3' && date.getDate() == '1') {
            message.react('🪙');
        }

        // If the winning number is on their card...
        let winner = false;
        if (chances.includes(value)) {
            // First, we check if their accounts are linked..
            await axios.get(client.endpoint + 'user/lookup/discordUsername/' + username)
                .then(function(response) {
                    const outcome = response.data;
                    if (outcome.status === 'success') {

                        // If we have a connected account...
                        if ('twitchUUID' in outcome.response) {
                            // set winner
                            winner = true;

                            // Mark the message with the coin
                            message.react('🪙');

                            // Actually add the coins
                            axios.get(client.endpoint + 'coins/insert/2/' + outcome.response.twitchUUID + '/10/' + encodeURIComponent('Chatting in discord'))
                                .then(function(response) {
                                    const outcome = response.data;

                                    let content = '';
                                    if (outcome.status === 'success') {
                                        content = `KC_HANDOUT, SUCCESS, <@${message.author.id}>, 10, false, [${chances}], [${value}]`;
                                    }
                                    else if (outcome.status === 'failure') {
                                        message.react('‼️');
                                        message.reply({ content: `<@${userID}>, something went wrong! I'll ping <@215630012060139522>!` });
                                        content = `KC_HANDOUT, FAILURE, <@${message.author.id}>, 0, ${outcome.err_msg}, [${chances}], [${value}]`;
                                    }

                                    message.channel.client.channels.fetch(client.settings.channels.bot_log)
                                        .then(channel => {
                                            channel.send({
                                                content: `${content}`,
                                            });
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(console.error);
                        }
                        // If we don't...
                        else if (!('twitchUUID' in outcome.response)) {
                            // If they haven't opted out...
                            if (outcome.response.syncOptOut !== '1') {
                                message.reply({ content: `<@${userID}>, I attempted to give you free 🪙 KomfyCoins, but you haven't linked your Twitch account! To make sure you don't miss any in the future, make sure you use the /link command!` });
                            }
                        }
                    }
                    // If we're here, something went wrong...
                    else if (outcome.status === 'failure') {
                        // message.react('‼️');
                        // message.reply({ content: `<@${userID}>, something went wrong! I'll ping <@215630012060139522>!` });
                    }
                    else {
                        // message.react('‼️');
                        // message.reply({ content: `<@${userID}>, I don't know how you got here! I'll ping <@215630012060139522>!` });
                    }
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });
        }

        // April Fools - Everybody wins (jk, lol)!
        if (date.getMonth() == '3' && date.getDate() == '1' && !winner) {
            setTimeout(() => {
                message.reactions.cache.forEach(reaction => reaction.remove('🪙'));
                message.react('😜');

                setTimeout(() => {
                    message.reactions.cache.forEach(reaction => reaction.remove('😜'));
                }, 30000, message);
            }, 30000, message);
        }
    }

};