const { roll } = require('./dice.js');
const fs = require('fs');

const noTableItem = {
    name: '[Table does not exist!]',
    value: 0
}

function rollTable(tableName, die = 0, returnObject = false, fudge = 0){
    try{ require('../data/' + tableName + '.json'); }
    catch(err){
        return returnObject ? noTableItem : noTableItem.name
    }
    const table = require('../data/' + tableName + '.json')
    if(die <= 0){
        die = table.length
    }
    let r = (fudge === 0 ? roll(die) : fudge)
    if(r > table.length){
        r = table.length
    }
    const result = table.find(item => item.value === r)
    if(returnObject){
        return result
    } return result.name

}

module.exports = {
    rollTable
}