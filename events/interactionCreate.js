const { Events } = require("discord.js");
const { getActiveDungeon } = require("../lib/functions/dungeons.js");
const {getChannel} = require("../index.js")
// const { moveRow } = require("../lib/components/move-buttons.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(
					`No command matching ${interaction.commandName} was found.`
				);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: "There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		} 
        else if (interaction.isButton()) {
            // await console.log("Yay")
            const channel = getChannel()
			const dungeon = await getActiveDungeon()
            // const channel = dungeon.active_channel
            channel.send('test')
            
		}
	},
};
