const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel-list')
		.setDescription('Command to output channel list')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

		await interaction.deferReply();
		const message = await interaction.fetchReply();
		interaction.deleteReply();

		let output = '**__The Channels__** \r\n\r\n';
		output += '📌 | Information: \r\n';
		output += '○ <#1045082408233484330>: The channel for news all about our community & the stream. Don\'t worry, the everyone ping will only be used for bigger news! \r\n';
		output += '○ <#1045084204389650563>: Bot notifications for when Kiwi goes live! \r\n';
		output += '○ <#1131379343491334205>: Bot notifications for when Streamer/Creator friends recommended by Kiwi go live! \r\n';
		output += '○ <#1131398170400796752> : Bot notifactions for when Kiwi posted a new piece of content, like YouTube Videos or the like! \r\n';
		output += '○ <#1045082408233484334>: Any ideas or feedback to give? Let it all out here. \r\n';
		output += '\r\n';
		output += '📌 | Chat: \r\n';
		output += '○ <#1131393202264473650>: Bot notifactions for when we get new members! Be sure to welcome them! \r\n';
		output += '○ <#1045082408233484332>: The general chat to talk to everyone. \r\n';
		output += '○ <#1045082408233484333>: Any gaming related conversations. \r\n';
		output += '○ <#1045086371401961472>: Show us your tasty meals here. \r\n';
		output += '○ <#1045086534564581456>: Made something cool? Show it off! \r\n';
		output += '○ <#1045086498032197633>: Share selfies or pictures from your life with us. \r\n';
		output += '○ <#1045086638692380762>: We always love to see your cute pets! And any other cute friends as well, obviously. \r\n';
		output += '○ <#1045354681423110226>: Found or experienced something objectively good and/or heartwarming? Share it! We could all use some good news, for once, after all... \r\n';
		output += '○ <#1045086187817287820>: LGBTQIA+ news, conversations and related goodness! \r\n';
		output += '○ <#1045085902168395868>: I mean... Ya know. \r\n';
		output += '○ <#1045087314822578266>: Let us know when you go live. \r\n';
		output += '\r\n';
		output += '📌 | Voice Channels:  \r\n';
		output += '○ <#1045085101756792882>: Essentially just a channel to throw anything in y\'all might be talking about in the voice channels in the moment to give context. \r\n';

		const channel = interaction.client.channels.cache.get(message.channelId);
		channel.send({ content: output });
	},
};