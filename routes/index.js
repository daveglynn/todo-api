var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('.././db.js');
var middleware = require('.././middleware.js')(db);

router
	.route('/')
	.get(function(req, res) {
		res.send('Todo API Test');
	});


router
	.route('/todos')
	.get(middleware.requireAuthentication, function(req, res) {
		var query = req.query;
		var where = {
			userId: req.user.get('id')
		};

		if (query.hasOwnProperty('completed') && query.completed === 'true') {
			where.completed = true;
		} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
			where.completed = false;
		}

		if (query.hasOwnProperty('q') && query.q.length > 0) {
			where.description = {
				$like: '%' + query.q + '%'
			};
		}

		db.todo.findAll({
			where: where
		}).then(function(todos) {
			res.json(todos);
		}, function(e) {
			res.status(500).send();
		})
	});


router
	.route('/todos/:id')
	.get(middleware.requireAuthentication, function(req, res) {

		var todoId = parseInt(req.params.id, 10);

		db.todo.findOne({
			where: {
				id: todoId,
				userId: req.user.get('id')
			}
		}).then(function(todo) {
			if (!!todo) {
				res.json(todo.toJSON());
			} else {
				res.status(404).send();
			}
		}, function(e) {
			res.status(500).send();
		})
	});


router
	.route('/todos')
	.post(middleware.requireAuthentication, function(req, res) {
		console.log(req.body);
		//remove unnecessary data
		var body = _.pick(req.body, 'description', 'completed');
		console.log(body);
		db.todo.create(body).then(function(todo) {
			req.user.addTodo(todo).then(function() {
				return todo.reload();
			}).then(function(todo) {
				res.json(todo.toJSON());
			});
		}, function(e) {
			res.status(400).json(e);

		});
	});


router
	.route('/todos/:id')
	.delete(middleware.requireAuthentication, function(req, res) {

		var todoId = parseInt(req.params.id, 10);

		db.todo.destroy({
			where: {
				id: todoId,
				userId: req.user.get('id')
			}
		}).then(function(rowsDeleted) {
			if (rowsDeleted === 0) {
				res.status(404).json({
					error: 'No Todo found with id'
				});
			} else {
				res.status(204).send();
			}
		}, function() {
			res.status(500).send();
		});
	});


router
	.route('/todos/:id')
	.put(middleware.requireAuthentication, function(req, res) {
		var todoId = parseInt(req.params.id, 10);
		var body = _.pick(req.body, 'description', 'completed');
		var attributes = {};

		if (body.hasOwnProperty('completed')) {
			attributes.completed = body.completed;
		}

		if (body.hasOwnProperty('description')) {
			attributes.description = body.description;
		}

		db.todo.findOne({
			where: {
				id: todoId,
				userId: req.user.get('id')
			}
		}).then(function(todo) {
			if (todo) {
				todo.update(attributes).then(function(todo) {
					res.json(todo.toJSON());
				}, function(e) {
					res.status(400).json(e);
				});
			} else {
				res.status(404).send();
			}
		}, function() {
			res.status(500).send();
		});
	});


router
	.route('/users')
	.post(function(req, res) {

		//remove unnecessary data
		var body = _.pick(req.body, 'email', 'password');

		db.user.create(body).then(function(user) {
			res.json(user.toPublicJSON())
		}, function(e) {
			res.status(400).json(e);
		});
	});


router
	.route('/users/login')
	.post(function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		userInstance = user;
		return db.token.create({
			token: token
		});

	}).then(function(tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function() {
		res.status(401).send();
	});
});


router
	.route('/users/login')
	.delete(middleware.requireAuthentication, function(req, res) {
		req.token.destroy().then(function() {
			res.status(204).send();
		}).catch(function() {
			res.status(500).send();
		});
	});


module.exports = router;