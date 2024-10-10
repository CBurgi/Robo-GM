const { SlashCommandBuilder } = require('discord.js')
const { rollTable } = require('../../lib/functions/tables.js')
const { roll } = require('../../lib/functions/dice.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('make-npc')
		.setDescription('Make a new NPC.')
        .addStringOption(option =>
            option.setName('area')
                .setDescription('The area you find this NPC.')
                .addChoices(
                    {name: 'Wilderness', value: 'wilderness'},
                    {name: 'Village', value: 'village'},
                    {name: 'City', value: 'city'},
                )
        )
        .addStringOption(option =>
            option.setName('gender')
                .setDescription("The new NPC's gender. Leave blank for random, type 'n' for no gender")
        ),
	async execute(interaction) {
        await interaction.deferReply()
        const gender = interaction.options.getString('gender') ? interaction.options.getString('gender') : 'r'
        const area = interaction.options.getString('area') ? interaction.options.getString('area') : 'wilderness'
        const response = makeNPC(gender, area)
		await interaction.editReply(response)
	},
}

function makeNPC(gender, area){
    const raceObj = rollTable('race', 20 , true) //genasi (d4)
    const genasiAdd = (raceObj.value === 20 ? (rollTable('race-genasi') + ' ') : '')

    const response = 'Rolling a new NPC!\n'
    + '**Introducing**: ' + rollName(raceObj.value) + ", the "
    + rollGender(gender) + genasiAdd + raceObj.name + ' '
    + rollBackground(area) + ' - ' + rollTable('suit-modifier') + '.\n\n'
    + '**Appearance:** ' + rollDescriptor('appearance') + '\n'
    + '**Personality:** ' + rollDescriptor('personality') + '\n'
    + '**Quirk:** ' + rollDescriptor('quirk') + '\n'
    + '**Goal:** ' + rollTable('focus-action') + ' ' + rollTable('focus-topic') + ' - ' + rollTable('suit-modifier')
    
    return response
}

function rollName(raceVal){
    let nameTable = 'name-'

    if(raceVal < 4){
        nameTable += 'warborn'
    }else if(raceVal >= 4 && raceVal < 8){
        nameTable += 'weaveborn'
    }else if(raceVal >= 8 && raceVal < 12){
        nameTable += 'commonborn'
    }else if(raceVal >= 12 && raceVal < 14){
        nameTable += 'scrapborn'
    }else if(raceVal >= 14 && raceVal < 16){
        nameTable += 'stoneborn'
    }else if(raceVal >= 16){
        nameTable += 'subweaveborn'
    }

    return rollTable(nameTable)
}

function rollGender(gender){
    if(gender === 'n'){
        return ''
    }else if(gender === 'r'){
        return (roll(2) === 2 ? 'male ' : 'female ')
    }else{
        return gender.trim() + ' '
    }
}

function rollBackground(area){
    const bObj = rollTable('background-' + area, 13, true)
    let response = bObj.name
    if(area === 'wilderness'){
        if(bObj.value === 12){
            response += ": " + rollTable('background-village')
        }else if(bObj.value === 13){
            response += ": " + rollTable('background-city')
        }
    }
    return response
}

function rollDescriptor(type){
    let response = ''
    let dObj = rollTable('descriptor-' + type, 13, true)
    if(dObj.value != 13){
        response += dObj.name + ' - ' + rollTable('suit-modifier')
    }else{
        response += rollTable('descriptor-' + type, 12) + ' - ' + rollTable('suit-modifier')
        response += repeatDescriptor(type)
    }

    return response
}
function repeatDescriptor(type){
    let dObj = rollTable('descriptor-' + type, 13, true)
    let response = ''
    if(dObj.value != 13){
        response += ', ' + dObj.name + ' - ' + rollTable('suit-modifier')
    }else{
        response += ', ' + rollTable('descriptor-' + type, 12) + ' - ' + rollTable('suit-modifier')
        response += repeatDescriptor(type)
    }
    return response
}