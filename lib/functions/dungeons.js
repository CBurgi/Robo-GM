const {Dungeons, startingRoom} = require('./databases.js')
const {roll} = require('./dice.js')
const {rollTable} = require('./tables.js')
const { s, sc, f, guy, intersect, horiz, vert, vertDoor, directionBinary, paths} = require('../components/map-pieces.js')

async function getActiveDungeon(){
    const dungeonQ = await Dungeons.findOne({where: {active: true}})
    if(!dungeonQ){
        return {name: 'No active Dungeons.', e: 'No-Active-Dungeon'}
    } 
    const dungeon = {
        name: dungeonQ.get('name'),
        size: dungeonQ.get('size'),
        rooms: JSON.parse(dungeonQ.get('rooms')),
        player_x: dungeonQ.get('player_x'),
        player_y: dungeonQ.get('player_y'),
        active_channel: dungeonQ.get('active_channel'),
    }

    return dungeon
}

async function openDungeon(size = 10, name, channel){
    const active = await Dungeons.findOne({where: {active: true}})
    if(active){
        return {name: 'Another dungeon is already active', e: 'Active-Dungeon'}
    }

    let dungeonQ = await Dungeons.findOne({where: {name: name}})
    if(!dungeonQ){
        const maker = makeDungeon(size, name)
        if(maker.e){
            return maker
        }
    } 

    await Dungeons.update({active: true}, {where: {name: name}})
    await Dungeons.update({active_channel: channel}, {where: {name: name}})
    dungeonQ = await Dungeons.findOne({where: {name: name}})

    const dungeon = {
        name: dungeonQ.get('name'),
        size: dungeonQ.get('size'),
        rooms: JSON.parse(dungeonQ.get('rooms')),
        player_x: dungeonQ.get('player_x'),
        player_y: dungeonQ.get('player_y'),
        active_channel: dungeonQ.get('active_channel'),
    }

    return dungeon
}

async function makeDungeon(size, name){
    try{
        const dungeon = await Dungeons.create({
            name: name,
            size: size,
            rooms: JSON.stringify([{...startingRoom}]),
            player_x: 0,
            player_y: 0
        })

        return {name: 'All good'}
    }catch (e){
        return {name: 'An error occured when creating this dungeon.', error: e}
    }
}

const rd = new Map([
    ['N', {l: 'W', o: 'S', r: 'E'}],
    ['S', {l: 'E', o: 'N', r: 'W'}],
    ['E', {l: 'N', o: 'W', r: 'S'}],
    ['W', {l: 'S', o: 'E', r: 'N'}],
])
const rd_pushEast = new Map([
    ['N', {a: 'N', b: 'E'}],
    ['S', {a: 'S', b: 'E'}],
    ['E', {a: 'N', b: 'S'}],
    ['W', {a: 'N', b: 'S'}],
])
function makeNewRoom(dungeon, move){
    if(dungeon.rooms.find(r => r.x === dungeon.player_x && r.y === dungeon.player_y)){
        return dungeon       
    }

    const d = roll(dungeon.size) - Math.abs(dungeon.player_x) - Math.abs(dungeon.player_y)
    const ds = rollTable('room-doors')
    let doors = [rd.get(move).o]
    if(d < 1){
    }else if(ds === 1){
        doors = [move, rd.get(move).o]
    }else if (ds === 2){
        if(dungeon.player_x < 1 && Math.abs(dungeon.player_y) < 2 ){
            doors = [rd.get(move).o, rd_pushEast.get(move).a, rd_pushEast.get(move).b]
        }else{
            doors = [rd.get(move).o, rd.get(move).l, rd.get(move).r]
        }
    }else{
        doors = ['N', 'S', 'E', 'W']
    }

    const description = rollTable('room-description')
    const encounter = rollTable('room-encounter')
    const object = rollTable('room-object')

    const newRoom = {
        x: dungeon.player_x,
        y: dungeon.player_y,
        doors: doors,
        description: description,
        encounter: encounter,
        object: object
    }
    dungeon.rooms.push(newRoom)
    return dungeon
}

function makeMap(dungeon, moveMessage = ''){
    let response = dungeon.name + ' (' + dungeon.player_x + ',' + dungeon.player_y + '): '
    + moveMessage + '`\n'
    
    response += makeRoomMap(dungeon)
            
    const room = dungeon.rooms.find(r => r.x === dungeon.player_x && r.y === dungeon.player_y)
    response += '**Description:** ' + room.description + '\n'
    response += '**Encounter:** ' + room.encounter + '\n'
    response += '**Object:** ' + room.object
    
    return response
}

function makeRoomMap(dungeon){
    const rs = []
    for (let y = dungeon.player_y - 1; y <= dungeon.player_y + 1; y++) {
        for (let x = dungeon.player_x - 1; x <= dungeon.player_x + 1; x++) {
            const r = dungeon.rooms.find(r => r.x === x && r.y === y)
            if(r){
                rs.push({e: true, d: r.doors})
            }else{
                rs.push({e: false})
            }
        }    
    }
    const response = ' ' + intersect(f, f, rs[0]) + horiz(f, rs[0]) + intersect(f, f, rs[1], rs[0]) + horiz(f, rs[1]) + intersect(f, f, rs[2], rs[1]) + horiz(f, rs[2]) + intersect(f, f, f, rs[2]) + ' \n'
    + ' ' + vert(rs[0]) + s + vert(rs[0], rs[1]) + s + vert(rs[1], rs[2]) + s + vert(rs[2]) + ' \n'
    + ' ' + vertDoor(f, rs[0]) + s + vertDoor(rs[0], rs[1]) + s + vertDoor(rs[1], rs[2]) + s + vertDoor(rs[2]) + ' \n'
    + ' ' + vert(rs[0]) + s + vert(rs[0], rs[1]) + s + vert(rs[1], rs[2]) + s + vert(rs[2]) + ' \n'
    + ' ' + intersect(f, rs[0], rs[3]) + horiz(rs[0], rs[3]) + intersect(rs[0], rs[1], rs[4], rs[3]) + horiz(rs[1], rs[4]) + intersect(rs[1], rs[2], rs[5], rs[4]) + horiz(rs[2], rs[5]) + intersect(rs[2], f, f, rs[5]) + ' \n'
    + ' ' + vert(rs[3]) + s + vert(rs[3], rs[4]) + s + vert(rs[4], rs[5]) + s + vert(rs[5]) + ' \n'
    + ' ' + vertDoor(f, rs[3]) + s + vertDoor(rs[3], rs[4]) + sc + vertDoor(rs[4], rs[5]) + s + vertDoor(rs[5]) + ' \n'
    + ' ' + vert(rs[3]) + s + vert(rs[3], rs[4]) + s + vert(rs[4], rs[5]) + s + vert(rs[5]) + ' \n'
    + ' ' + intersect(f, rs[3], rs[6]) + horiz(rs[3], rs[6]) + intersect(rs[3], rs[4], rs[7], rs[6]) + horiz(rs[4], rs[7]) + intersect(rs[4], rs[5], rs[8], rs[7]) + horiz(rs[5], rs[8]) + intersect(rs[5], f, f, rs[8]) + ' \n'
    + ' ' + vert(rs[6]) + s + vert(rs[6], rs[7]) + s + vert(rs[7], rs[8]) + s + vert(rs[8]) + ' \n'
    + ' ' + vertDoor(f, rs[6]) + s + vertDoor(rs[6], rs[7]) + s + vertDoor(rs[7], rs[8]) + s + vertDoor(rs[8]) + ' \n'
    + ' ' + vert(rs[6]) + s + vert(rs[6], rs[7]) + s + vert(rs[7], rs[8]) + s + vert(rs[8]) + ' \n'
    + ' ' + intersect(f, rs[6]) + horiz(rs[6]) + intersect(rs[6], rs[7]) + horiz(rs[7]) + intersect(rs[7], rs[8]) + horiz(rs[8]) + intersect(rs[8]) + ' \n`'
    return response
}

async function updateDungeon(dungeon){
    const store = {
        ...dungeon,
        rooms: JSON.stringify(dungeon.rooms)
    }
    await Dungeons.update(store, {where: {name: dungeon.name}})
}
async function updateRooms(dungeon){
    const store = JSON.stringify(dungeon.rooms)
    await Dungeons.update({rooms: store}, {where: {name: dungeon.name}})
}

function makeMiniMap(dungeon){
    let response = dungeon.name + ':`\n'
    const rooms = dungeon.rooms
    const minX = Math.min(...rooms.map(i => i.x))
    const maxX = Math.max(...rooms.map(i => i.x))
    const minY = Math.min(...rooms.map(i => i.y))
    const maxY = Math.max(...rooms.map(i => i.y))
    let blank = ''

    for (let x = minX; x <= maxX + 2; x++) {
        blank += '   '
    }blank += '\n'

    response += blank
    for (let y = minY; y <= maxY; y++) {
        response += '   '
        for (let x = minX; x <= maxX; x++) {
            const room = rooms.find(r => r.x === x && r.y === y)
            let doorVal = 0;
            if(x === dungeon.player_x && y === dungeon.player_y){
                response += guy
            }else if(room){
                room.doors.forEach(d => { doorVal += directionBinary[d] });
                response += paths[doorVal]
            }else{
                response += paths[0]
            }
        }
        response += '   \n'
    }
    response += blank + '`'
    return response
}

async function closeDungeon(name){
    await Dungeons.update({active: false}, {where: {name: name}})
    await Dungeons.update({active_channel: '0'}, {where: {name: name}})
}
async function closeActiveDungeon(){
    await Dungeons.update({active_channel: '0'}, {where: {active: true}})
    await Dungeons.update({active: false}, {where: {active: true}})
}

module.exports = {
    getActiveDungeon,
    openDungeon,
    makeNewRoom,
    makeMap,
    updateDungeon,
    updateRooms,
    makeMiniMap,
    closeDungeon,
    closeActiveDungeon
}