const { SlashCommandBuilder } = require('discord.js')
const { rollTable } = require('../../lib/functions/tables.js')
const { roll } = require('../../lib/functions/dice.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('question')
		.setDescription('Ask a yes/no or open-ended question.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of question you want to ask (Yes/No or Action, Detail, or Topic).')
                .addChoices(
                    {name: 'Yes/No', value: 'yn'},
                    {name: 'Action', value: 'action'},
                    {name: 'Detail', value: 'detail'},
                    {name: 'Topic', value: 'topic'},
                )
        )
        .addNumberOption(option =>
            option.setName('odds')
                .setDescription('The odds for a Yes/No question.')
                .addChoices(
                    {name: 'Certain', value: 2},
                    {name: 'Likely', value: 3},
                    {name: '50/50', value: 4},
                    {name: 'Unlikely', value: 5},
                    {name: 'Doubtful', value: 6},
                )
        )
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask (Optional).')
        )
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
        const type = interaction.options.getString('type') ? interaction.options.getString('type') : 'yn'
        const odds = interaction.options.getNumber('odds') ? interaction.options.getNumber('odds') : 4
        const question = interaction.options.getString('question') ? interaction.options.getString('question') : 'x'
        
        const response = questionFunc(chaos, type, odds, question)
		await interaction.editReply(response)
	},
}

function questionFunc(chaos, type, odds, question){
    let response = 'Rolling the answer to '
    if(type === 'yn'){
        const yesR = roll(6)
        response += (question === 'x' ? 'a yes/no question!' : 'the yes/no question:\n' + question) + '\n'
        + '**Answer:** ' + (yesR < odds ? 'No' : 'Yes')
        + ' ' + rollTable('question-qualification', chaos)
    }else{
        response += (question === 'x' ? 'an open-ended question!' : 'the open-ended question:\n' + question) + '\n'
        + '**' + type.charAt(0).toUpperCase() + type.slice(1) +':** ' + rollTable('focus-' + type)
        + ', ' + rollTable('suit-modifier')
    }

    return response
}