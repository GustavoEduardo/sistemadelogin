const Sequelize = require('sequelize');

const connection = new Sequelize('loginEsenha','root','135790',{
	host: 'localhost',
	dialect: 'mysql',
	timezone: "-03:00"

});

module.exports = connection;
