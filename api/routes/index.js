"use strict";
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('../.././db.js');
var middleware = require('../.././middleware.js')(db);
var ctrlTodo = require('../controllers/todo.controller.js');
var ctrlTenant = require('../controllers/tenant.controller.js');
var ctrlUser = require('../controllers/user.controller.js');

router
	.route('/users')
	.post(ctrlUser.usersPost);
router
	.route('/users/login')
	.post(ctrlUser.usersLogin);
router
	.route('/users/login')
	.delete(middleware.requireAuthentication, ctrlUser.usersLogout);

router
	.route('/todos')
	.get(middleware.requireAuthentication, ctrlTodo.todosGetByUserId);
router
	.route('/todos/all')
	.get(middleware.requireAuthentication, ctrlTodo.todosGetAll);
router
	.route('/todos/:id')
	.get(middleware.requireAuthentication, ctrlTodo.todosGetById);
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
	.route('/tenants/all')
	.get(middleware.requireAuthentication, ctrlTenant.tenantsGetAll);
router
	.route('/tenants/:id')
	.get(middleware.requireAuthentication, ctrlTenant.tenantsGetById);
router
	.route('/tenants')
	.post(middleware.requireAuthentication, ctrlTenant.tenantsPost);
router
	.route('/tenants/:id')
	.delete(middleware.requireAuthentication, ctrlTenant.tenantsDelete);
router
	.route('/tenants/:id')
	.put(middleware.requireAuthentication, ctrlTenant.tenantsPut);

module.exports = router;