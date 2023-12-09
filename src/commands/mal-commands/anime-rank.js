const { SlashCommandBuilder } = require('discord.js');
const { fetchList, appendParams } = require('../../util/mal-fetch');
const { api_base_URL } = require('../../config.json');
const { buildEmbedList } = require('../../util/embed-types');
const paginate = require('../../util/paging.js');
const sendDetails = require('../../util/details.js');
const REQUEST_PAGE_SIZE = 100;

module.exports = {
    cooldown: 5,
    paginated: true,

    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('get a list of anime ranked by category')
        .addStringOption(option => option.setName('category')
            .setDescription('the category of the ranking')
            .setChoices(
                { name: 'all time', value: 'all' },
                { name: 'airing now', value: 'airing' },
                { name: 'upcoming', value: 'upcoming' },
                { name: 'tv series', value: 'tv' },
                { name: 'movies', value: 'movie' },
                { name: 'ovas', value: 'ova' },
                { name: 'specials', value: 'special' },
                { name: 'by popularity', value: 'bypopularity' },
                { name: 'by favorites', value: 'favorite' },
            )
            .setRequired(true)
        )
        .addIntegerOption(option => option.setName('number_of_entries')
            .setDescription('the number of anime to include in this ranking')
            .setMinValue(1).setMaxValue(1000)
        ),

    async execute(interaction) {
        const ranking_type = interaction.options.getString('category');
        const num_entries = interaction.options.getInteger('number_of_entries') || REQUEST_PAGE_SIZE;

        const request = new URL(`${api_base_URL}/anime/ranking`);
        const params = new URLSearchParams({
            ranking_type,
            limit: num_entries,
            fields: 'mean'
        });

        let title;
        switch(ranking_type) {
            case 'tv': title = 'Top Anime TV Series:';
                break;
            case 'ova': case 'special': case 'movie':
                title = `Top Anime ${ranking_type[0].toUpperCase()}${ranking_type.slice(1)}s:`;
                break;
            case 'all': title = 'Top Anime of All Time:';
                break;
            case 'airing': title = 'Top Anime Airing Now';
                break;
            case 'upcoming': title = 'Top Upcoming Anime';
                break;
            case 'bypopularity': title = 'Top Anime by Popularity';
                break;
            case 'favorite': title = 'Top Favorited Anime';
                break;
        }
        await interaction.deferReply();
        const data_list = await fetchList(`${request}?${params}`, num_entries > REQUEST_PAGE_SIZE);
        const embed_list = buildEmbedList(title, interaction.user, data_list.slice(0, num_entries || data_list.length));
        const { client: { collectors } } = interaction;

        collectors.get(interaction.channel)?.stop();
        paginate(interaction, embed_list);
        collectors.set(interaction.channel, (await sendDetails(interaction, data_list)));
    }
};