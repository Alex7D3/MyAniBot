const { SlashCommandBuilder } = require('discord.js');
const { fetchList, fetchAnimeDetails, sleep, appendParams } = require('../../util/mal-fetch.js');
const { buildEmbedList, buildDetailEmbeds } = require('../../util/embed-types');
const { api_base_url } = require('../../config.json');
const paginate = require('../../util/paging.js');
const sendDetails = require('../../util/details.js');
const fuzzySearch = require('../../util/fuzzy-match.js');
const nsfw = false; //fully implement later
const LIST_PAGE_SIZE = 100, LUCKY_PAGE_SIZE = 15;
const WAIT_TIME = 2000;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Searches for an anime by title and displays relevant information.')
        .addStringOption(option => option.setName('title')
            .setDescription('title of your search')
            .setRequired(true)
        )
        .addBooleanOption(option => option.setName('im_feeling_lucky')
            .setDescription('Responds with a detailed embed instead of a list of results.')
        ),

	async execute(interaction) {
        const { options } = interaction;
        const q = options.getString('title');
        const request = new URL(`${api_base_url}/anime`);
        const params = new URLSearchParams({
            q,
            limit: LIST_PAGE_SIZE,
            fields: 'alternative_titles,mean'
        });

        const title = `Results for "${q}":`;
        await interaction.deferReply();
        if(options.getBoolean('im_feeling_lucky')) {
            params.set('limit', LUCKY_PAGE_SIZE);
            const data_list = await fetchList(`${request}?${params}`, false);
            await sleep(WAIT_TIME);
            const candidate = fuzzySearch(q, data_list);
            const node = await fetchAnimeDetails(candidate.node.id);
            const embed_list = buildDetailEmbeds(node, interaction.user);
            paginate(interaction, embed_list, title);
            return;
        }
        const data_list = await fetchList(`${request}?${params}`);
        const embed_list = buildEmbedList(title, interaction.user, data_list);
        const { client: { collectors } } = interaction;
        collectors.get(interaction.channel)?.stop();
        paginate(interaction, embed_list);
        collectors.set(interaction.channel, (await sendDetails(interaction, data_list)));
	}
};