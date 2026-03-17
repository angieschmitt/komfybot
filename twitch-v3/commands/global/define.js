import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'define',
    help: 'Provides a definition for a word. Usage: !def <word:required>',
    list: false,
    allowOffline: false,
    aliases: {
        'def': {
			arg: false,
			list: true,
		},
    }
};

export const actions = {
    default: {
        args: {
            required: [ 1 ],
            error: 'don\'t forgot the word!',
        },
        execute(args, tags, message, channel, client) {
            let content = '';

            const lookup = args[1].trim().toLowerCase();

            axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + lookup)
                .then(function(response) {
                    const resData = response.data;

                    if (message in resData) {
                        if (resData.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
                            content = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
                        }
                    }
                    else {
                        content = `@${tags.username}, ${lookup} can be defined as a... `;
                        const meanings = resData[0].meanings;
                        Object.entries(meanings).forEach(([key]) => {
                            content += `${meanings[key].partOfSpeech} : ${meanings[key].definitions[0].definition} || `;
                        });

                        content = content.substring(0, content.length - 3).trim();

                        if (resData[0].phonetic) {
                            content += ` It is pronounced like: ${resData[0].phonetic}`;
                        }
                    }
                })
                .catch(function(caught) {
                    const resData = caught.response.data;
                    if (resData.message == 'Sorry pal, we couldn\'t find definitions for the word you were looking for.') {
                        content = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
                    }
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
        },
    },
};