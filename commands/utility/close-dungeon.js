const { SlashCommandBuilder } = require('discord.js')
const { getActiveDungeon, closeDungeon } = require('../../lib/functions/dungeons.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-dungeon')
		.setDescription('Closes active dungeon.'),
	async execute(interaction) {
        await interaction.deferReply()
        const dungeon = await getActiveDungeon()
        const dName = dungeon.name
        await closeDungeon(dName)
        const response = 'Closed ' + dName + '.'
		await interaction.editReply(response)
	},
}