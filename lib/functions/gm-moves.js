const { rollTable } = require('../../lib/functions/tables.js')
const { eventComplication } = require('../../lib/functions/events.js')
const { roll } = require('../../lib/functions/dice.js')

function pacingMove(){
    let response = "Rolling a new pacing move!"
    const move = rollTable('move-pacing', 6, true)
    response += "\n**Move:** " + move.name

    if(move.value === 6){
        response += "\n\n" + eventComplication()
    }

    return response
}

function failureMove(){
    let response = "Rolling a new failure move!"
    response += "\n**Move:** " + rollTable('move-failure', 6)

    return response
}

module.exports = {
    pacingMove,
    failureMove
}