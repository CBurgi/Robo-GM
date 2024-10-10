const { rollTable } = require('../../lib/functions/tables.js')

function actionFocus(suit = true){
    let response = "Rolling a new action!" + '\n'
    + '**Action:** ' + rollTable('focus-action')
    if(suit){
        response += ', ' + rollTable('suit-modifier')
    }

    return response
}

function detailFocus(suit = true){
    let response = "Rolling a new detail!" + '\n'
    + '**Detail:** ' + rollTable('focus-detail')
    if(suit){
        response += ', ' + rollTable('suit-modifier')
    }

    return response
}

function topicFocus(suit = true){
    let response = "Rolling a new topic!" + '\n'
    + '**Topic:** ' + rollTable('focus-topic')
    if(suit){
        response += ', ' + rollTable('suit-modifier')
    }

    return response
}

module.exports = {
    actionFocus,
    detailFocus,
    topicFocus
}