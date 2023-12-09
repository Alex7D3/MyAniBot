const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    paginated: false,
    data: new SlashCommandBuilder()
        .setName('help').setDescription('recieve help for using the features of this bot'),
    async execute(interaction) {
        interaction.reply({
            content: 'Alex was too lazy to make this right now. I\'m sure you can figure things out.'
        });
    }
};