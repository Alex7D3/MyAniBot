const path = require('node:path');
const fs = require('node:fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { startServer } = require('./server.js');
const { startDB } = require('./DBConfig.js');
require('dotenv').config();
//const avatar_path = path.join(__dirname, 'images', 'avatars');

//const avatars = fs.readdirSync(avatar_path).map(img => path.join(avatar_path, img));

startServer();
if(process.env.db_connection)
    (async () => {
        await startDB();
    })();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, c => {
    const hour = new Date().getHours();
    console.log(`Good ${
        (hour >= 18) ? 'evening' :
        (hour >= 12) ? 'afternoon' : 'morning'
    }. Logged in as ${c.user.tag}`);
    //client.user.setAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.pagers = new Collection();
client.collectors = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandArr = require('./get-commands')(commandsPath);
commandArr.forEach(command => client.commands.set(command.data.name, command));

client.login(process.env.token);

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand())
        return;

    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
		console.error(`faulty command: ${interaction.commandName}. No such command.`);
		return;
	}

    const timestamp = client.cooldowns.get(interaction.user.id);
    const { cooldown = 3 } = command;
    if(timestamp) {
        const remaining = Math.floor((timestamp - Date.now()) / 1000) + cooldown;
        await interaction.reply({
            content: `You're too fast! Please wait ${remaining} seconds.`,
            ephemeral: true
        });
        return;
    } try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		if (interaction.replied || interaction.deferred)
			await interaction.followUp({
                content: 'This command has been deferred.',
                ephemeral: true
            });
		else
			await interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
	} finally {
        client.cooldowns.set(interaction.user.id, Date.now());
        setTimeout(() => {
            client.cooldowns.delete(interaction.user.id);
        }, cooldown);
    }
});