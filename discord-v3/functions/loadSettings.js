import axios from 'axios';

export default async function(client){
    try {
        const response = await axios.get(client.endpoint + 'discord/settings/' + client.userID);
        const data = response.data;

        client.settings = [];
        if (data) {
            client.settings.channels = data.response.channels;
            client.settings.notifications = data.response.notifications;
            client.settings.permissions = data.response.permissions;
            client.settings.rule_roles = data.response.rule_roles;
            client.settings.notify_roles = data.response.notify_roles;
            client.settings.pronouns = data.response.pronouns;
            client.settings.misc_roles = data.response.misc_roles;
            client.settings.optin_roles = data.response.optin_roles;
            client.settings.faqs = data.response.faqs;
            client.settings.shoutouts = data.response.shoutouts;

            // This is a container...
            client.settings.messages = [];
        }

        return client;
    }
    catch (error) {
        // console.log(error);
    }
};