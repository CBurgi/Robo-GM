const { rollTable } = require('../../lib/functions/tables.js')
const { roll } = require('../../lib/functions/dice.js')

function randomEvent(chaos = 10){
    let response = "Rolling a new random event!" + '\n'
    + "**Character focus:** " + (roll(2) === 2 ? "NPC" : "PC") + ' '
    + rollTable('event-catalyst', chaos) + '\n'
    + "**Inspiration:** " + rollTable('focus-action', chaos) + ' '
    + rollTable('focus-topic', chaos) + ', '
    + rollTable('suit-modifier')

    return response
}

function eventAlteration(chaos = 10){
    let response = "Rolling a new random event!" + '\n'
    + "**Character focus:** " + (roll(2) === 2 ? "NPC" : "PC") + ' '
    + rollTable('event-catalyst', chaos) + '\n'
    + "**Inspiration:** " + rollTable('focus-topic', chaos) + ' '
    + rollTable('focus-action', chaos) + ', '
    + rollTable('suit-modifier')

    return response
}

function eventComplication(){
    let response = "Rolling a new event complication!"
    response += "\n**Complication:** " + rollTable('event-complication', 6)

    return response
}

module.exports = {
    randomEvent,
    eventAlteration,
    eventComplication
}