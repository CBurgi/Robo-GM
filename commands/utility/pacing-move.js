const { SlashCommandBuilder } = require('discord.js')
const { pacingMove } = require('../../lib/functions/gm-moves.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pacing-move')
		.setDescription('Roll a random pacing move to spice up a scene.'),
	async execute(interaction) {
        await interaction.deferReply()
        const response = pacingMove()
		await interaction.editReply(response)
	},
}