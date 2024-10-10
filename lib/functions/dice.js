function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
  }

function roll(max) {
    return getRandomInt(1, max)
}

module.exports = {
    getRandomInt,
    roll
}