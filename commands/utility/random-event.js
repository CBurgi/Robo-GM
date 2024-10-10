const { SlashCommandBuilder } = require('discord.js')
const { randomEvent } = require('../../lib/functions/events.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-event')
		.setDescription('Roll a random event.')
        .addNumberOption(option =>
            option.setName('chaos-factor')
                .setDescription('Your current chaos factor die number.')
                .addChoices(
                    {name: '*Boring (d20)', value: 20},
                    {name: 'Under control (d12)', value: 12},
                    {name: 'Average (d10)', value: 10},
                    {name: 'Out of control (d8)', value: 8},
                    {name: 'Madness (d6)', value: 6},
                    {name: '*Abject chaos (d4)', value: 4},
                )
        ),
	async execute(interaction) {
        await interaction.deferReply()
        const chaos = interaction.options.getNumber('chaos-factor') ? interaction.options.getNumber('chaos-factor') : 10
        const response = randomEvent(chaos)
		await interaction.editReply(response)
	},
}