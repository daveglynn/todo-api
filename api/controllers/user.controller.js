"use strict";
var db = require('../.././db.js');
var _ = require('underscore');
var common = require('../business/common.business');
var business = require('../business/user.business');

module.exports.usersPost = function(req, res) {

    // pick appropiate fields and set tenant
    var body = business.setPost(req, 'C');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON())
	}, function(e) {
		res.status(400).json(e);
	});
};

module.exports.usersLogin = function(req, res) {
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
};


module.exports.usersLogout = function(req, res) {
	req.token.destroy().then(function() {
		res.status(204).send();
	}).catch(function() {
		res.status(500).send();
	});
};
