import { CommandInteraction } from "discord.js";

export async function handleCommand(interaction: CommandInteraction) {
    const command = commands.get(interaction.commandName);
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
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
                content: 'This command has been deferred.',
                ephemeral: true
            });
        } else {
			await interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
        }
	} finally {
        client.cooldowns.set(interaction.user.id, Date.now());
        setTimeout(() => {
            client.cooldowns.delete(interaction.user.id);
        }, cooldown);
    }
}