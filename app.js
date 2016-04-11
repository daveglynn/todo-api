var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var routes = require('./api/routes');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = []

var todoNextId = 1;

app.use(bodyParser.json());

app.use('/',routes);

db.sequelize.sync({
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT);
	});
});