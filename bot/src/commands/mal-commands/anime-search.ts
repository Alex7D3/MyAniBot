import {
    SlashCommandBuilder,
    AutocompleteInteraction,
    ChatInputCommandInteraction
} from 'discord.js';

const { fetchList, fetchAnimeDetails, sleep, appendParams } = require('#utils/requests.js');
const { buildEmbedList, buildDetailEmbeds } = require('#utils/embeds.js');
const paginate = require('#utils/paging.js');
const sendDetails = require('#utils/details.js');
const redis = require('../../redis-config.js');
const nsfw = false; //fully implement later
const LIST_PAGE_SIZE = 100, LUCKY_PAGE_SIZE = 15;
const WAIT_TIME = 2000;

const commonOptions = function () {

};

export const data = new SlashCommandBuilder()
	.setName('search')
	.setDescription('Searches for an anime by title and displays relevant information.')

	.addStringOption(option => option.setName('title')
		.setDescription('Title of your search')
		.setRequired(true) 
	)
	.addStringOption(option => option.setName('type')
		.setChoices(
			{ name: 'Anime', value: 'ANIME' },
			{ name: 'Manga', value: 'MANGA' },
		)
	)
	.addStringOption(option => option.setName('format')
        .setChoices(
            { name: 'TV', value: 'TV'},
            { name: 'Short', value: 'TV_SHORT' },
            { name: 'Movie', value: 'MOVIE' },
            { name: 'Special', value: 'SPECIAL' },
            { name: 'OVA', value: 'OVA' },
            { name: 'ONA', value: 'ONA' },
            { name: 'Music', value: 'MUSIC' },
            { name: 'Manga', value: 'MANGA' },
            { name: 'Light Novel', value: 'NOVEL' },
            { name: 'One Shot', value: 'ONE_SHOT' }

        )
    )
    .addStringOption(option => option.setName('status')
        .setChoices(
            { name: 'Finished', value: 'FINISHED'},
            { name: 'Releasing', value: 'RELASING'},
            { name: 'Upcoming', value: 'NOT_YET_RELEASED'},
            { name: 'Cancled', value: 'CANCELED'},
            { name: 'Hiatus', value: 'HIATUS'},
        )
    )
    .addStringOption(option => option.setName('country')
        .setChoices(
            { name: 'Japan', value: 'JP'},
            { name: 'South Korea', value: 'SK'},
            { name: 'China', value: 'CN'},
            { name: 'Taiwan', value: 'TW'},

        )
    )


export async function execute(interaction: ChatInputCommandInteraction) {
	const { options } = interaction;
	const title = options.getString('title');

	if (options.getBoolean('recent')) {

	}
	const params = new URLSearchParams({
		q: title,
		limit: LIST_PAGE_SIZE,
		fields: 'alternative_titles,mean'
	});

	const message = `Results for "${title}":`;
	await interaction.deferReply();
	const data_list = await fetchList(`${request}?${params}`, false);
	const embed_list = buildEmbedList(title, interaction.user, data_list);
	const { client: { collectors } } = interaction;
	collectors.get(interaction.channel)?.stop();
	paginate(interaction, embed_list);
	collectors.set(interaction.channel, (await sendDetails(interaction, data_list)));
}

export async function autocomplete(interaction: AutocompleteInteraction) {
	const search: string = interaction.options.getString('title');
	if (interaction.options.) {
		// query redis for suggestions on user recent list.
		const recents = [];
		interaction.respond([]);
	} else {
		// use anilist search to get titles and id's, when option selected query full data.

	}
}
