const { SlashCommandBuilder } = require('discord.js')
const { rollTable } = require('../../lib/functions/tables.js')
const { randomEvent, eventAlteration, eventComplication } = require('../../lib/functions/events.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scene-setup')
		.setDescription('Set up a new scene.')
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
        const response = sceneSetup(chaos)
		await interaction.editReply(response)
	},
}

function sceneSetup(chaos){
    let response = "Rolling new scene using a d" + chaos +"!"

    const setupObj = rollTable('scene-setup', chaos, true)
    response += "\nThis scene is " + setupObj.name

    if(setupObj.value <= 2){
        response += "\n\n" + randomEvent(chaos)
    }else if(setupObj.value <= 4){
        response += "\n\n" + eventAlteration(chaos)
    }

    response += "\n\n" + eventComplication()

    return response
}