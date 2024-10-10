const { SlashCommandBuilder } = require('discord.js')
const { draw } = require('../../lib/functions/deck.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('draw')
		.setDescription('Draws a card'),
	async execute(interaction) {
        const card = draw()
		await interaction.reply(`You drew the ${card.number.name} of ${card.suit.name}!`)
	},
}