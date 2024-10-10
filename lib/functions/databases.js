const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const Dungeons = sequelize.define('dungeons', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
    size: Sequelize.INTEGER,
    //insert JSON.stringify([obj to insert]) to store
    //const obj = JSON.parse([retrieved string]) to retrieve
	rooms: Sequelize.TEXT,
	player_x: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	player_y: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    active_channel: Sequelize.STRING
});

const startingRoom = {
    x: 0,
    y: 0,
    doors: ['N', 'E', 'S'],
    description: 'Empty',
    encounter: 'none',
    object: 'mundane objects'
}

module.exports = {
    Dungeons,
    startingRoom
}