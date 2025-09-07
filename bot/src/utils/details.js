const paginate = require('./paging');
const { buildDetailEmbeds } = require('./embeds.js');
const { fetchAnimeDetails } = require('./mal-fetch.js');
const regex = /^(details \d+)|(d\d+)$/;
const filter = message => regex.test(message.content);
module.exports = async function(interaction, data_list, timeout = 600_000, cooldown = 5_000) {
	const { client } = interaction;
	const collector = interaction.channel.createMessageCollector({ filter, time: timeout });

	collector.on('collect', async message => {
		if (client.cooldowns.has(message.author.id)) return message.reply({
			content: 'You are attempting to query data too quickly! Please Try again later.',
			ephemeral: true
		});
		const index = message.content.match(/\d+/) - 1;
		if (index < 0 || index >= data_list.length) return message.reply({
			content: `Selected entry must be in range 1 - ${data_list.length}.`,
			ephemeral: true
		});
		const { id } = data_list[parseInt(index)].node;
		const node = await fetchAnimeDetails(id);
		const embed_list = buildDetailEmbeds(node, message.author);
		paginate(interaction, embed_list);

		client.cooldowns.set(message.author.id, Date.now());
		setTimeout(() => {
			client.cooldowns.delete(message.author.id);
		}, cooldown);
	});
	return collector;
};