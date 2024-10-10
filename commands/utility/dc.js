const { SlashCommandBuilder } = require('discord.js')
const { getRandomInt } = require('../../lib/functions/dice.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dc')
		.setDescription('Set a DC.')
        .addNumberOption(option =>
            option.setName('difficulty')
                .setDescription('Your current chaos factor die number.')
                .addChoices(
                    {name: 'Very Easy', value: 5},
                    {name: 'Easy', value: 10},
                    {name: 'Medium', value: 15},
                    {name: 'Hard', value: 20},
                    {name: 'Very Hard', value: 25},
                    {name: 'Impossible', value: 30},
                )
        ),
	async execute(interaction) {
        await interaction.deferReply()
        const difficulty = interaction.options.getNumber('difficulty') ? interaction.options.getNumber('difficulty') : 15
        const dc = difficulty + getRandomInt(-1, 1)
        const response = 'The DC for this roll is: ' + dc
		await interaction.editReply(response)
	},
}