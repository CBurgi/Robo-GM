const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Component,
} = require("discord.js");
const { openDungeon, makeMap, closeDungeon } = require('../../lib/functions/dungeons.js')
const { moveRow } = require('../../lib/components/move-buttons.js')

const generate = new ButtonBuilder()
	.setCustomId("gen")
	.setLabel("Generate")
	.setStyle(ButtonStyle.Primary);
const genRow = new ActionRowBuilder().addComponents(generate);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("make-dungeon")
		.setDescription("Make a new dungeon layout.")
        .addStringOption((option) =>
            option.setName('name')
                .setDescription("The new dungeon's name.")
                .setRequired(true)
        )
		.addNumberOption((option) =>
			option
				.setName("size")
				.setDescription("The size of the dungeon.")
				.addChoices(
					{ name: "Tiny (house, outpost)", value: 4 },
					{ name: "Small (manor, temple)", value: 6 },
					{ name: "*Medium (d8)", value: 8 },
					{ name: "Large (standard dungeon)", value: 10 },
					{ name: "*Very Large (d12)", value: 12 },
					{ name: "Massive (catacombs)", value: 20 }
				)
		),
	async execute(interaction) {
        await interaction.deferReply()

        const size = interaction.options.getNumber("size")
        ? interaction.options.getNumber("size") : 10;
        const name = interaction.options.getString("name");
        let responseObj = {};

        const dungeon = await openDungeon(size, name, interaction.channel.id)
        if(dungeon.e){
            responseObj = await interaction.editReply({
                content: dungeon.name,
                components: [],
            });
        }else{
            const map = makeMap(dungeon)
    
            responseObj = await interaction.editReply({
                content: map,
                components: moveRow,
            });
        }

        try {
            // const collectorFilter = (i) => i.user.id === interaction.user.id;
            const confirmation = await responseObj.awaitMessageComponent({
                // filter: collectorFilter,
                time: 600_000, //10 minutes
                // time: 10_000
            });
        
            await confirmation.update({ content: "---", components: [] });
            await confirmation.deleteReply();
        } catch (e) {
            await closeDungeon(name)
            await interaction.editReply({
                content: "Dungeon closed due to interaction timeout.",
                components: [],
            });
        }
		
	},
};