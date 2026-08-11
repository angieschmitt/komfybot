import axios from 'axios';

import functionsFunc from '../../functions/index.js';
let functions = functionsFunc();

export const settings = {
    name: 'define',
    help: 'Provides a definition for a word. Usage: !def <word:required>',
    list: false,
    allowOffline: true,
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

            axios.get('https://freedictionaryapi.com/api/v1/entries/en/' + lookup)
                .then(function(response) {
                    const resData = response.data;

                    if ( resData.entries.length > 0 ){
                        content = `@${tags.username}, ${lookup} can be defined as... `;

                        const entries = resData.entries;
                        Object.entries(entries).forEach(([key, data]) => {
                            Object.entries(data.senses).forEach(([key2, sense]) => {
                                if (!Object.values(sense.tags).includes('slur')) {
                                    content += `${data.partOfSpeech} : ${sense.definition} || `;
                                }
                            });
                        });
                        content = content.substring(0, content.length - 3).trim();

                    }
                    else {
                        content = `Sorry @${tags.username}, we couldn't find definitions for the word you were looking for.`;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(function() {
                    if (content !== '') {
                        functions.sayHandler(client, content);
                    }
                });
                
        },
    },
};