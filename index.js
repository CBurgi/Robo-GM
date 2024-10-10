const fs = require('node:fs');
const path = require('node:path');
const { Events, Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Dungeons } = require('./lib/functions/databases.js')
const { getActiveDungeon, makeMap, closeDungeon, makeNewRoom, updateDungeon, makeMiniMap } = require('./lib/functions/dungeons.js')
const { moveRow, mapRow } = require('./lib/components/move-buttons.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    } 
    else if (interaction.isButton()) {
        const moves = ['N', 'S', 'E', 'W']
        const moveNames = new Map([
            ['N', 'North'],
            ['S', 'South'],
            ['E', 'East'],
            ['W', 'West'],
        ])
        let dungeon = await getActiveDungeon()
        if(dungeon.e){
            await interaction.channel.send({
                content: 'Dungeon was closed.',
                components: [],
            })
            return
        }
        if(moves.includes(interaction.customId) || interaction.customId === 'MR'){
            let moveMessage = ''
            if(moves.includes(interaction.customId)){
                const move = interaction.customId
                const moveName = moveNames.get(move)
                const room = dungeon.rooms.find(r => r.x === dungeon.player_x && r.y === dungeon.player_y)
    
                
                if(room.doors.includes(move)){
                    dungeon.player_y += (move === 'N' ? -1 : 0)
                    dungeon.player_y += (move === 'S' ? 1 : 0)
                    dungeon.player_x += (move === 'E' ? 1 : 0)
                    dungeon.player_x += (move === 'W' ? -1 : 0)
                    dungeon = makeNewRoom(dungeon, move)
                    await updateDungeon(dungeon)
                    moveMessage = 'Moved ' + moveName
                }else{
                    moveMessage = 'Cannot move ' + moveName
                }
            }
            const map = makeMap(dungeon, moveMessage)
            sendObj = await interaction.channel.send({
                content: map,
                components: moveRow,
            }).then(async sentMessage => {
                try {
                    // const collectorFilter = (i) => i.user.id === interaction.user.id;
                    const confirmation = await sentMessage.awaitMessageComponent({
                        // filter: collectorFilter,
                        time: 600_000, //10 minutes
                        // time: 10_000
                    });
                
                    await confirmation.update({ content: "---", components: [] });
                    await sentMessage.delete();
                } catch (e) {
                    await closeDungeon(dungeon.name)
                    await sentMessage.edit({
                        content: "Dungeon closed due to interaction timeout.",
                        components: [],
                    });
                }
            })
        }else if(interaction.customId === 'M'){
            const map = makeMiniMap(dungeon)
            sendObj = await interaction.channel.send({
                content: map,
                components: mapRow,
            }).then(async sentMessage => {
                try {
                    // const collectorFilter = (i) => i.user.id === interaction.user.id;
                    const confirmation = await sentMessage.awaitMessageComponent({
                        // filter: collectorFilter,
                        time: 600_000, //10 minutes
                        // time: 10_000
                    });
                
                    await confirmation.update({ content: "---", components: [] });
                    await sentMessage.delete();
                } catch (e) {
                    await closeDungeon(dungeon.name)
                    await sentMessage.edit({
                        content: "Dungeon closed due to interaction timeout.",
                        components: [],
                    });
                }
            })
        }else if (interaction.customId === 'X'){
            const dName = dungeon.name
            await closeDungeon(dName)
            const response = 'Closed ' + dName + '.'
            await interaction.channel.send({
                content: response,
                components: [],
            })
        }
    }
})

client.once(Events.ClientReady, readyClient => {
    if(process.argv.indexOf('-r') > -1 || process.argv.indexOf('--reset-dungeons') > -1){
        Dungeons.sync({ force: true });
    }else{
        Dungeons.sync();
    }
	console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.login(token);