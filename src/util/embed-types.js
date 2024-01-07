const { EmbedBuilder } = require('discord.js');
const { anime_url, mal_url, base_discord_id_url } = require('../config.json');

const getAuthorSettings = (author) => {
    const { displayName, id } = author;
    return {
        name: displayName,
        url: `${base_discord_id_url}/${id}`,
        iconURL: author.displayAvatarURL({ dynamic: true })
    };
};

module.exports = {
    buildMosaicEmbed(title, author, data_list) {
        const embeds = data_list.map(({ node }) => new EmbedBuilder()
            .setURL(mal_url).setImage(node.main_picture.large));
        embeds[0].setTitle(title).setColor(0x2E51A2)
            .setAuthor(getAuthorSettings(author));
        return embeds;
    },

    buildEmbedList(title, author, data_list, page_len = 10, metric = 'mean') {
        const total_len = Math.ceil(data_list.length / page_len);
        const embed_list = [];
        for(let offset = 0; offset < data_list.length; offset += page_len) {
            embed_list.push(new EmbedBuilder()
                .setTitle(title).setColor(0x2E51A2)
                .setURL(mal_url).setAuthor(getAuthorSettings(author))
                .setDescription(data_list.slice(offset, offset + page_len)
                .map(({ node }, i) =>
                    `**${i + offset + 1}.** [${node.title}](${anime_url}/${node.id}) \`${node[metric] ?? 'N/A'}\``
                    .padEnd(40)
                    ).join('\n')
                )
                .setTimestamp()
                .setFooter({ text: `Page ${embed_list.length + 1}/${total_len}` })
            );
        }
        return embed_list;
    },

    //use graphing library for stats in the future
    buildDetailEmbeds(node, author) {
        const common_fields = {
            title: node.title,
            color: 0x2E51A2,
            url: `${anime_url}/${node.id}`,
            author: getAuthorSettings(author),
            timestamp: new Date().toISOString()
        };
        const { statistics, recommendations, related_anime, average_episode_duration, num_episodes, studios, genres, synopsis } = node;
        const { synonyms, ja, en } = node.alternative_titles || { synonyms: [] };
        const { year, season } = node.start_season || { year: false, season: false };
        return [
            {
                ...common_fields,
                description: `**${season ? (season[0].toUpperCase() + season.slice(1)) : '} ${year ? year + ' | ' : '}` +
                    `${node.media_type.toUpperCase()} | ` +
                    `rated ${node.rating?.replace('_', ' ').toUpperCase() ?? 'N/A'} | ` +
                    `${node.status.replaceAll('_', ' ')}**\n` +
                    `- **Studios:** ${studios.length ? studios.map(s => s.name).join(', ') : '*unknown*'}\n` +
                    `- **Genres:** ${genres.length ? genres.map(g => g.name).join(', ') : '*nothing yet*'}`,
                fields: [
                    {
                        name: `**SCORE**`,
                        value: `\`${node.mean ?? 'N/A'}\``,
                        inline: true
                    },
                    {
                        name: `**RANK**`,
                        value: `\`${node.rank ?? 'N/A'}\``,
                        inline: true
                    },
                    {
                        name: `**POPULARITY**`,
                        value: `\`${node.popularity ?? 'N/A'}\``,
                        inline: true
                    },
                ],

                image: {
                    url: node.main_picture.large
                },
                footer: { text: 'details➡' }
            },
            {
                ...common_fields,
                description: `${ja ? `- ${ja}\n` : '${en ? `- ${en}\n` : '}${synonyms.map(s => '- ' + s).join('\n')}`,
                fields: [
                    {
                        name: 'Source:',
                        value: `${node.source?.replaceAll('_', ' ') ?? '*nothing yet*'}`
                    },
                    {
                        name: 'Episode Info:',
                        value: `\`\`\`${'air date: '.padEnd(20) + (node.start_date || 'unknown')}\n` +
                        `${'episode count:'.padEnd(20) + (num_episodes || 'unknown')}\n` +
                        `avg episode length: ${average_episode_duration ?
                            Math.floor(average_episode_duration / 60) + ' mins' : 'unknown'}\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Related:',
                        value: related_anime.length ? related_anime.slice(0, Math.min(3, related_anime.length)).map(({ node: r }) =>
                            `> - [${r.title}](${anime_url}/${r.id})`).join('\n') : '*nothing yet*'
                    },
                    {
                        name: 'Recommendations:',
                        value: recommendations.length ? recommendations.slice(0, Math.min(3, recommendations.length)).map(({ node: r }) =>
                            `> - [${r.title}](${anime_url}/${r.id})`).join('\n') : '*nothing yet*'
                    }
                ],
                footer: { text: '⬅main page | statistics➡' }
            },
            {
                ...common_fields,
                fields: [
                    {
                        name: 'Global Stats',
                        value: `\`\`\`total list users: ${statistics.num_list_users}\n${Object.entries(statistics.status)
                            .map(([key, val]) => (key.replaceAll('_', ' ') + ': ').padEnd(18) + val).join('\n')}\`\`\``,
                    },
                    {
                        name: `User Stats for ${author.displayName}`,
                        value: '```Coming soon```'
                    }
                ],
                footer: { text: '⬅details | synopsis➡' }
            },
            {
                ...common_fields,
                fields: [
                    {
                        name: 'Synopsis:',
                        value: `${(synopsis.slice(0, 1000) + (synopsis.length > 1000 ? '...' : '')) || '*nothing yet*'}`
                    },
                    {
                        name: 'Background:',
                        value: `${node.background || '*nothing yet*'}`
                    }
                ],
                footer: { text: '⬅statistics' + (node.pictures ? ' | gallery➡' : '') }
            },
            ...node.pictures.map(({ large }, i) => ({
                ...common_fields,
                image: { url: large },
                footer: { text: `picture ${i + 1}` }

            }))
        ];
    }
};