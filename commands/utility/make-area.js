const { SlashCommandBuilder } = require('discord.js')
const { rollTable } = require('../../lib/functions/tables.js')
const { roll } = require('../../lib/functions/dice.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('make-area')
		.setDescription('Make a new hex area for travelling.')
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
        const response = makeArea(chaos)
		await interaction.editReply(response)
	},
}

function makeArea(chaos){
    const response = 'Rolling a new area!\n'
    + '**Terrain:** ' + rollTable('terrain', chaos) + '\n'
    + (roll(chaos) < 3 ? + '**Location found:** ' + rollTable('location') + ' - ' + rollTable('suit-modifier') : '**No location found.**') + '\n\n'
    + "If you want to start a scene but don't know where to begin, roll a random event!"

    return response
}