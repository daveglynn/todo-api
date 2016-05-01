"use strict";
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	var Sequelize = require("sequelize");
	var sequelize = new Sequelize('d2d', 'postgres', 'Houses22', {
		host: "localhost",
		port: 5432,
		dialect: 'postgres'
	});
	//
	//sequelize = new Sequelize(undefined, undefined, undefined, {
	//	'dialect': 'sqlite',
	//	'storage': __dirname + '/data/dev-todo-api.sqlite'
	//});
}

var db = {};

db.tenant = sequelize.import(__dirname + '/api/models/tenant.model.js');
db.order = sequelize.import(__dirname + '/api/models/order.model.js');
db.todo = sequelize.import(__dirname + '/api/models/todo.model.js');
db.user = sequelize.import(__dirname + '/api/models/user.model.js');
db.token = sequelize.import(__dirname + '/api/models/token.model.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user.belongsTo(db.tenant);
db.tenant.hasMany(db.user);
 
db.todo.belongsTo(db.tenant);
db.tenant.hasMany(db.todo);

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;