const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const toggleButtons = (components, page, length) => {
    components[0].setDisabled(page == 0);
    components[1].setDisabled(page == 0);
    components[2].setDisabled(page == length - 1);
    components[3].setDisabled(page == length - 1);
};

function getButtonRow() {
	ActionRowBuilder.addComponents()
}

module.exports = async function(interaction, embed_list, content, btn_timeout = 600_000) {
    let page = 0;
    const emojis = ['⏪', '◀', '▶', '⏩'];
    const row = new ActionRowBuilder()
        .addComponents(emojis.map(e =>
            new ButtonBuilder()
                .setEmoji(e)
                .setCustomId(e)
                .setStyle(ButtonStyle.Secondary)
            )
        );
    const { components } = row;
    toggleButtons(components, page, embed_list.length);
    const message = await interaction.followUp({
        content,
        embeds: [embed_list[page]],
        components: [row]
    });
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: btn_timeout
    });
    collector.on('collect', async btnInteraction => {
        switch(btnInteraction.customId) {
            case emojis[0]: page = 0;
                break;
            case emojis[1]: page--;
                break;
            case emojis[2]: page++;
                break;
            case emojis[3]: page = embed_list.length - 1;
                break;
        }
		components[0].setDisabled(page == 0);
		components[1].setDisabled(page == 0);
		components[2].setDisabled(page == length - 1);
		components[3].setDisabled(page == length - 1);
        await btn_interaction.update({
            embeds: [embed_list[page]],
            components: [row]
        });
    });
    collector.on('end', async () => {
        components.forEach(btn => btn.setDisabled(true));
        message.edit({ components: [row] });
        interaction.editReply({ content: '**(expired)**' });
    });
};