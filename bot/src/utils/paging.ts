import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import type { CommandInteraction, ButtonInteraction, APIEmbed } from 'discord.js';

export default async function(interaction: CommandInteraction, embedList: APIEmbed[],
                              content: string, btnTimeout = 600_000) {
  let page = 0;
  const first = new ButtonBuilder()
    .setEmoji('⏪')
    .setCustomId('first')
    .setStyle(ButtonStyle.Primary);
  const prev = new ButtonBuilder()
    .setEmoji('◀')
    .setCustomId('prev')
    .setStyle(ButtonStyle.Primary);
  const pageCount = new ButtonBuilder()
    .setLabel(`1/${embedList.length}`)
    .setCustomId('page_count')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
  const next = new ButtonBuilder()
    .setEmoji('▶')
    .setCustomId('next')
    .setStyle(ButtonStyle.Primary);
  const last = new ButtonBuilder()
    .setEmoji('⏩')
    .setCustomId('last')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents([first, prev, pageCount, next, last]);

  const message = await interaction.reply({
    content,
    embeds: [embedList[page]],
    components: [row.toJSON()]
  });

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: btnTimeout
  });
  collector.on('collect', async (btnInteraction: ButtonInteraction) => {
    if (interaction.user.id !== btnInteraction.user.id)
      return await btnInteraction.reply({
        content: `Only <@${interaction.user.id}> can navigate this message.`, ephemeral: true
      });

    await btnInteraction.deferUpdate();
    
    switch (btnInteraction.customId) {
      case "first":
        page = 0;
        break;
      case "prev":
        page--;
        break;
      case "next":
        page++;
        break;
      case "last":
        page = embedList.length - 1;
        break;
    }

    pageCount.setLabel(`${page + 1}/${embedList.length}`);

    first.setDisabled(page == 0);
    prev.setDisabled(page == 0);
    next.setDisabled(page == embedList.length - 1);
    last.setDisabled(page == embedList.length - 1);

    await btnInteraction.update({
      embeds: [embedList[page]],
      components: [row]
    });
  });

  collector.on('end', async () => {
    row.components.forEach(btn => btn.setDisabled(true));
    message.edit({ content, embeds: [embedList[page]], components: [row] });
  });

  return message;
};
