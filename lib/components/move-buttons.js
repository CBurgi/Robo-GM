const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

const generate = new ButtonBuilder()
	.setCustomId("gen")
	.setLabel("Generate")
	.setStyle(ButtonStyle.Primary);
const genRow = new ActionRowBuilder().addComponents(generate);

const north = new ButtonBuilder()
	.setCustomId("N")
	.setLabel("North ▲")
	.setStyle(ButtonStyle.Secondary);
const south = new ButtonBuilder()
	.setCustomId("S")
	.setLabel("South ▼")
	.setStyle(ButtonStyle.Secondary);
const east = new ButtonBuilder()
	.setCustomId("E")
	.setLabel("East ►")
	.setStyle(ButtonStyle.Secondary);
const west = new ButtonBuilder()
	.setCustomId("W")
	.setLabel("West ◄")
	.setStyle(ButtonStyle.Secondary);
const map = new ButtonBuilder()
	.setCustomId("M")
	.setLabel("Map [#]")
	.setStyle(ButtonStyle.Primary);
const exit = new ButtonBuilder()
	.setCustomId("X")
	.setLabel("Exit ☒")
	.setStyle(ButtonStyle.Danger);
const moveRowA = new ActionRowBuilder().addComponents(map, north, exit);
const moveRowB = new ActionRowBuilder().addComponents(west, south, east);
const moveRow = [moveRowA, moveRowB];

const northD = new ButtonBuilder()
	.setCustomId("N")
	.setLabel("North ▲")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true);
const southD = new ButtonBuilder()
	.setCustomId("S")
	.setLabel("South ▼")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true);
const eastD = new ButtonBuilder()
	.setCustomId("E")
	.setLabel("East ►")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true);
const westD = new ButtonBuilder()
	.setCustomId("W")
	.setLabel("West ◄")
	.setStyle(ButtonStyle.Secondary)
	.setDisabled(true);
const mapR = new ButtonBuilder()
	.setCustomId("MR")
	.setLabel("Map [#]")
	.setStyle(ButtonStyle.Success);

const mapRowA = new ActionRowBuilder().addComponents(mapR, northD, exit);
const mapRowB = new ActionRowBuilder().addComponents(westD, southD, eastD);
const mapRow = [mapRowA, mapRowB];

// const moveRow = new ActionRowBuilder().addComponents(west, north, south, east);

module.exports = {
	genRow,
	moveRow,
    mapRow
};
