var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('../.././db.js');
var middleware = require('../.././middleware.js')(db);
var ctrlTodo = require('../controllers/todo.controller.js');
var ctrlUser = require('../controllers/user.controller.js');

router
	.route('/')
	.get(function(req, res) {
		res.send('Welcome to my ToDo Application');
	});

router
	.route('/todos')
	.get(middleware.requireAuthentication, ctrlTodo.todosGet);

router
	.route('/todos/:id')
	.get(middleware.requireAuthentication, ctrlTodo.todosGetId);

router
	.route('/todos')
	.post(middleware.requireAuthentication, ctrlTodo.todosPost);

router
	.route('/todos/:id')
	.delete(middleware.requireAuthentication, ctrlTodo.todosDelete);

router
	.route('/todos/:id')
	.put(middleware.requireAuthentication, ctrlTodo.todosPut);

router
	.route('/users')
	.post(ctrlUser.usersPost);

router
	.route('/users/login')
	.post(ctrlUser.usersLogin);

router
	.route('/users/login')
	.delete(middleware.requireAuthentication, ctrlUser.usersLogout);


module.exports = router;