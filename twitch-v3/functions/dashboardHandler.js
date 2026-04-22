import axios from 'axios';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function dashboardLoader(client, type = false, reset = false){
    const parent = this;

    await axios.get(client.endpoint + 'load/retrieve/' + client.userID)
        .then(function(response) {
            if (response.data.status == 'success') {
                const resData = response.data.response;

                // If we have a specific type, only refresh that data...
                if (type) {
                    console.log(client.channel + ' : REFRESH : ' + type);
                    parent.dashboardHandler(type, resData[type], client, reset);

                    if (type == 'aliases') {
                        parent.dashboardHandler('commands', resData['commands'], client, reset);
                    }
                }
                // Otherwise, refresh it all...
                else {
                    // Setup the containers..
                    const addons = resData.addons;
                    const aliases = resData.aliases;
                    const commands = resData.commands;
                    const data = resData.data;
                    const events = resData.events;
                    const reactwords = resData.reactwords;
                    const redeems = resData.redeems;
                    const overlays = resData.overlays;
                    const settings = resData.settings;
                    const store = resData.store;
                    const timers = resData.timers;

                    // Load in for later use...
                    parent.dashboardHandler('aliases', aliases, client, true);

                    // Important ones first...
                    parent.dashboardHandler('settings', settings, client, true);
                    parent.dashboardHandler('addons', addons, client, true);
                    parent.dashboardHandler('overlays', overlays, client, true);

                    // Now the interactive ones...
                    parent.dashboardHandler('data', data, client, true);
                    parent.dashboardHandler('events', events, client, true);
                    parent.dashboardHandler('redeems', redeems, client, true);
                    parent.dashboardHandler('store', store, client, true);
                    parent.dashboardHandler('reactwords', reactwords, client, true);
                    parent.dashboardHandler('timers', timers, client, true);

                    // Commands are always last...
                    parent.dashboardHandler('commands', commands, client, true);
                }
            }
        })
        .catch((err) => {
            // client.debug.write(client.channel, 'dashboardLoad', err.message);
        })
        .finally(() => {
            return client;
        });
}

export async function dashboardHandler(type, data, client, reset = false){
    const parent = this;

    // Otherwise process based on type...
    if (type == 'addons') {
        parent.addonsHandler(data, client, reset);
    }
    else if (type == 'aliases') {
        parent.aliasesHandler(data, client, reset);
    }
    else if (type == 'commands') {
        parent.commandsHandler(data, client, reset);
    }
    else if (type == 'data') {
        parent.dataHandler(data, client, reset);
    }
    else if (type == 'events') {
        parent.eventsHandler(data, client, reset);
    }
    else if (type == 'overlays') {
        parent.overlaysHandler(data, client, reset);
    }
    else if (type == 'reactwords') {
        parent.reactwordsHandler(data, client, reset);
    }
    else if (type == 'redeems') {
        parent.redeemsHandler(data, client, reset);
    }
    else if (type == 'settings') {
        parent.settingsHandler(data, client, reset);
    }
    else if (type == 'store') {
        parent.storeHandler(data, client, reset);
    }
    else if (type == 'timers') {
        parent.timersHandler(data, client, reset);
        parent.timerHandler(client, true);
    }

    return client;
}

export async function addonsHandler(data, client, reset = false) {

    if (!('addons' in client) || reset) {
        client.addons = new Array();
    }

    if (data !== false) {
        client.addons = JSON.parse(data, 'utf-8');
    }

    return client;
};

export async function aliasesHandler(data, client, reset = false) {

    if (!('aliases' in client) || reset) {
        client.aliases = new Array();
    }

    if (data !== false) {
        client.aliases = data;
    }

    return client;
}

export async function commandsHandler(data, client, reset = false) {
    const parent = this;

    if (!('commands' in client) || reset) {
        client.commands = new Array();
        client.commands['global'] = new Array();
        client.commands['user'] = new Array();
    }

    // Handle the folder first...
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            const actions = command.actions;
            const settings = command.settings;
            
            if (settings.name in client.settings.commands) {
                if (client.settings.commands[command.name] === 0) {
                    settings.disabled = true;
                }
            }

            if ('addon' in settings) {
                if (!client.addons.includes(settings.addon)) {
                    settings.disabled = true;
                }
            }

            if (settings.disabled !== true) {
                if (settings.channel !== '' && settings.channel !== undefined) {
                    if (typeof settings.channel == 'object') {
                        Object.entries(settings.channel).forEach(([key, channel]) => { // eslint-disable-line no-unused-vars
                            if (client.userID == channel) {
                                client.commands['user'][settings.name] = {'actions':actions, 'settings':settings};
                                if (settings.aliases !== undefined && Object.keys(settings.aliases).length > 0) {
                                    Object.entries(settings.aliases).forEach(([key, data]) => {
                                        client.commands['user'][key] = {
                                            'settings': { name: key, arg: data.arg, list: data.list }
                                        };
                                    });
                                }
                            }
                        });
                    }
                }
                else {
                    client.commands['global'][settings.name] = {'actions':actions, 'settings':settings};

                    if (settings.aliases !== undefined && Object.keys(settings.aliases).length > 0) {
                        Object.entries(settings.aliases).forEach(([key, data]) => {
                            client.commands['global'][key] = {
                                'settings': { name: settings.name, arg: data.arg, list: data.list }
                            };
                        });
                    }
                    if (settings.name in client.aliases) {
                        const aliasList = client.aliases[settings.name].split(',');
                        Object.entries(aliasList).forEach(([key, text]) => { // eslint-disable-line no-unused-vars
                            client.commands['global'][key] = {
                                'settings': { name: settings.name, arg: false, list: true }
                            };
                        });
                    }
                }
            }
        }
    }

    // Now handle the commands from the dashboard...
    if (data !== false) {
        Object.entries(data).forEach(([index, command]) => { // eslint-disable-line no-unused-vars
            Object.entries(command).forEach(([name, data]) => {

                // If it's a user created on, add it to the list..
                if (!(name in client.commands['user'])) {
                    client.commands['user'][name] = {
                        'settings': {
                            list: data['list'],
                            name: name,
                            allowOffline: data['allowOffline']
                        }
                    };

                    delete data['list'];
                    delete data['allowOffline'];

                    client.commands['user'][name]['actions'] = { 'default': data };
                }

                // Handle Aliases
                if ('aliases' in data) {
                    Object.entries(data['aliases']).forEach(([alias]) => {
                        client.commands['user'][alias] = {
                            'settings': {
                                name: name,
                                arg: false,
                                list: false,
                            }
                        };
                    });
                }
            });
        });
    }

    console.log(client.commands.global);
    // console.log(client.commands.user);

    return client;
};

export async function dataHandler(data, client, reset = false) {
    
    // If the data bucket doesn't exist...
    if (!('data' in client)) {
        client.data = [];
    }

    Object.entries(data).forEach(([type, data]) => {
        client.data[type] = JSON.parse(data);
    });

    return client;
};

export async function eventsHandler(data, client, reset = false) {

    if (!('events' in client) || reset) {
        client.events = new Array();
    }

    if (data !== false) {
        Object.entries(data).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
            client.events[idx] = item;
        });
    }

    return client;
};

export async function overlaysHandler(data, client, reset = false) {
    const parent = this;

    if (!('overlay' in client) || reset) {
        client.overlay = new Array();
    }

    if (data !== false) {
        Object.entries(data).forEach(([idx, item]) => { // eslint-disable-line no-unused-vars
            const overlayName = item['name'].toLowerCase().replace(' ', '-');
            client.overlay[overlayName] = [];
            if ('data' in item.content) {
                client.overlay[overlayName]['data'] = item.content.data;
            }
            if ('settings' in item.content) {
                client.overlay[overlayName]['settings'] = item.content.settings;
            }

            // Special callouts...
            if (overlayName == 'chaos-mode'){
                client.overlay[overlayName]['triggers'] = [];
                Object.entries(client.overlay['chaos-mode'].data).forEach(([idx, data]) => { // eslint-disable-line no-unused-vars
                    const triggers = data.trigger.split(',');
                    triggers.forEach((idx2) => {
                        client.overlay[overlayName]['triggers'][idx2.toString()] = data.mediaID;
                    });
                });
            }
        });
    }

    return client;
};

export async function reactwordsHandler(data, client, reset = false) {

    if (!('reactwords' in client) || reset) {
        client.reactwords = {};
    }

    if (data !== false) {
        Object.entries(data).forEach(([uuid, reactWords]) => { // eslint-disable-line no-unused-vars
            client.reactwords[uuid] = {};
            Object.entries(reactWords).forEach(([word, response]) => {
                client.reactwords[uuid][ word ] = response;
            });
        });
    }

    return client;
};

export async function redeemsHandler(data, client, reset = false) {
    const parent = this;

    if (!('redeems' in client) || reset) {
        client.redeems = new Array();
        client.redeems.states = new Array();
    }

    if (data !== false) {
        Object.entries(data).forEach(([index, extra]) => { // eslint-disable-line no-unused-vars
            let redeemFunction = parent.redeemFileHandler(index);
            if ( redeemFunction ){
                client.redeems[index] = redeemFunction;
            }
        });
    }

    return client;
};

export async function settingsHandler(data, client, reset = false) {

    if (!('settings' in client) || reset) {
        client.settings = new Array();
        client.settings.currency = [];
        client.settings.passive = [];
        client.settings.commands = [];
        client.settings.slots = [];
    }

    if (data !== false) {
        if (Object.keys(data).length) {

            // Handle currency settings
            if ('currency' in data) {
                if ('enabled' in data.currency) {
                    // Basic Settings
                    client.settings.currency['enabled'] = data.currency.enabled;
                    client.settings.currency['name'] = [];
                    client.settings.currency['name']['single'] = data.currency.name_single;
                    client.settings.currency['name']['plural'] = data.currency.name_plural;
                }
            }
            else {
                client.settings.currency['enabled'] = false;
            }

            if ('passive' in data) {
                if ('enabled' in data.passive) {
                    client.settings.passive['enabled'] = data.passive.enabled;
                    client.settings.passive['amts'] = [];
                    client.settings.passive['amts']['default'] = data.passive.default;
                    client.settings.passive['amts']['subscribers'] = data.passive.subscribers;
                }
            }
            else {
                client.settings.passive['enabled'] = false;
            }

            if ('commands' in data) {
                Object.entries(data.commands).forEach(([key, value]) => {
                    client.settings.commands[ key ] = value;
                });
            }
            else {
                client.settings.commands = [];
            }

            if ('slots' in data) {
                Object.entries(data.slots).forEach(([key, value]) => {
                    client.settings.slots[ key ] = value;
                });
            }
            else {
                client.settings.slots = [];
            }
        }
    }

    return client;
};

export async function storeHandler(data, client, reset = false) {

    if (!('store' in client) || reset) {
        client.store = new Array();
        client.store.categories = [];
    }

    if (data !== false) {
        if (Object.keys(data).length) {

            // Handle currency settings
            if ('categories' in data) {
                Object.entries(data.categories).forEach(([idx, details]) => { // eslint-disable-line no-unused-vars
                    client.store.categories.push(idx);
                });
            }
            else {
                client.store.categories = [];
            }

        }
    }

    return client;
};

export async function timersHandler(data, client, reset = false) {

    if (!('timers' in client) || reset) {
        client.timers = new Array();
    }

    if (data !== false) {
        Object.entries(data).forEach(([index, timer]) => { // eslint-disable-line no-unused-vars
            Object.entries(timer).forEach(([name, data]) => {
                client.timers[name] = [];
                client.timers[name]['timer'] = parseInt(data['timer']);
                client.timers[name]['message'] = data['message'];
            });
        });
    }

    return client;
};

export function redeemFileHandler(redeemID) {
    const filePath = path.join(__dirname, '../redeems/' + redeemID + '.js');
    if (fs.existsSync(filePath)) {
        const redeemFile = require('../redeems/' + redeemID);
        return redeemFile;
    }
    return false;
};