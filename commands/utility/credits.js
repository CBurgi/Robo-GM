const { SlashCommandBuilder } = require('discord.js')
const { randomEvent } = require('../../lib/functions/events.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Inspiration and sources for the tables used in this bot.'),
	async execute(interaction) {
        await interaction.deferReply()
        const response = credit()
		await interaction.editReply(response)
	},
}

function credit(){
    return `Heres the sources that inspired this bot, and that provided most of the tables that it uses:
- **[One Page Solo Engine](<https://inflatablestudios.itch.io/one-page-solo-engine>)**: A minimal easy tool for GM-less TTRPG's that uses playing cards in a really interest ing way. They even have an app you can use!
- **[Mythic GM Emulator](<https://www.wordmillgames.com/mythic-gme.html>)**: A classic and very popular GM-less TTRPG tool, introduces a "Chaos factor" to make rolls more interesting.
- **[Morning Coffee Solo Variations](<https://pdfcoffee.com/mcsv-4-pdf-free.html?ref=randroll.com>)**: A small adaptation on Mythic's "Chaos facor"-based system that simplifies and streamlines it in a really nice way.
- **[The Book of Random Tables](<https://www.dicegeeks.com/>)**: A massive collection of random tables for all kinds of settings, scenarios, and uses.
- **[Me, Myself, and Die](<https://www.youtube.com/@MeMyselfandDieRPG>)**: The youtube series that first introduced me to the concept of GM-less TTRPG games.
`
}