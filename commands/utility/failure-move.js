const { SlashCommandBuilder } = require('discord.js')
const { failureMove } = require('../../lib/functions/gm-moves.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('failure-move')
		.setDescription('Roll a random pacing move to add a concequence.'),
	async execute(interaction) {
        await interaction.deferReply()
        const response = failureMove()
		await interaction.editReply(response)
	},
}