const { roll } = require('./dice.js')
const suits = require('../../lib/data/suits.json')
const cards = require('../../lib/data/cards.json')

function draw(){
    const suit = getSuit()
    const number = getCard()
    return {
        suit: suit,
        number: number,
    }
}
const getSuit = () => {
    const n = roll(4)
    return suits.find(suit => suit.value === n)
}
const getCard = () => {
    const n = roll(13)
    return cards.find(card => card.value === n)
}

module.exports = {
    draw,
    getSuit,
    getCard
}