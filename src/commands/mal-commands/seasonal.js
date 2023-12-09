const { SlashCommandBuilder } = require('discord.js');
const { fetchList, appendParams } = require('../../util/mal-fetch');
const { buildEmbedList, buildMosaicEmbed } = require('../../util/embed-types');
const paginate = require('../../util/paging.js');
const sendDetails = require('../../util/details.js');
const { api_base_URL } = require('../../config.json');
const LIST_PAGE_SIZE = 100, MOSAIC_PAGE_SIZE = 4;
const seasons = ['winter', 'spring', 'summer', 'fall'];
const seasonOf = (date) => seasons[Math.floor((date.getMonth() + 1) / 3) % 4];
module.exports = {
    cooldown: 5,
    paginated: true,
    data: new SlashCommandBuilder()
        .setName('seasonal')
        .setDescription('Get a list of anime by release season')
        .addStringOption(option => option.setName('season')
            .setDescription('the season of your search')
            .setChoices(...seasons.map(s => ({ name: s, value: s })))
        )
        .addIntegerOption(option => option.setName('year')
            .setDescription('the year of your search')
            .setMaxValue(2900).setMinValue(1900)
        )
        .addStringOption(option => option.setName('sort')
            .setDescription('sort the query results by ranking or popularity')
            .setChoices(
                { name: 'rank', value: 'anime_score' },
                { name: 'popularity', value: 'anime_num_list_users' }
        ))
        .addStringOption(option => option.setName('display_type')
            .setDescription('choose the format to display your query in')
            .setChoices(
                { name: 'list', value: 'list' },
                { name: 'mosaic', value: 'mosaic' }
        )),
    async execute(interaction) {
        const now = new Date();
        const { options } = interaction;
        const year = options.getInteger('year') || now.getFullYear();
        const season = options.getString('season') || seasonOf(now);
        const sort = options.getString('sort') || 'anime_num_list_users';
        const type = options.getString('display_type');
        const request = new URL(`${api_base_URL}/anime/season/${year}/${season}`);
        const params = new URLSearchParams({
            limit: LIST_PAGE_SIZE,
            sort,
            fields: 'num_list_users,mean'
        });
        const title = season[0].toUpperCase() + season.slice(1) + ` ${year} Anime`;
        await interaction.deferReply();
        if(type == 'mosaic') {
            request.searchParams.set('limit', MOSAIC_PAGE_SIZE);
            const data_list = await fetchList(request, false);
            return interaction.editReply({ embeds: buildMosaicEmbed(title, interaction.user, data_list) });
        }
        const data_list = await fetchList(`${request}?${params}`);
        const embed_list = buildEmbedList(title, interaction.user, data_list);
        const { client: { collectors } } = interaction;
        collectors.get(interaction.channel)?.stop();
        paginate(interaction, embed_list);
        collectors.set(interaction.channel, (await sendDetails(interaction, data_list)));
    }
};