
/******************************************************************************************************
 import Required Modules
******************************************************************************************************/

var db = require('../.././db.js');
var _ = require('underscore');
var common = require('../business/common.business');
var business = require('../business/todo.business');

/******************************************************************************************************
 Get All Records - Filtered by TenantId
******************************************************************************************************/
module.exports.todosGetAll = function (req, res) {
    
    var where = {};
    
    // builds clause
    where = common.setClauseGetAll(req);
    where = business.setClauseQuery(req.query, where);

    //find and return the records    
    db.todo.findAll({
        where: where
    }).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    })
};

/******************************************************************************************************
 Get All Records created by UserId - Filtered by TenantId
******************************************************************************************************/
module.exports.todosGetByUserId = function(req, res) {
    
	var where = {};
    
    // builds clause
    where = common.setClauseGetByUserId(req);
    where = business.setClauseQuery(req.query, where);

    //find and return the records  
	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	})
};
 
/******************************************************************************************************
 Get a Record created by Id - Filtered by TenantId
******************************************************************************************************/
module.exports.todosGetById = function(req, res) {
    
    var where = {};

    // builds clause
    where = common.setClauseGetById(req);

    //find and return the records 
	db.todo.findOne({
		where: where
	}).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	})
};

/******************************************************************************************************
 Insert a Record 
******************************************************************************************************/
module.exports.todosPost = function(req, res) {
    
    // pick appropiate fields
    var body = business.cleanPost(req);

    // create record on database, refresh and return local record to client
    db.todo.create(body).then(function (todo) {
        req.user.addTodo(todo).then(function () {
            return todo.reload();  
        }).then(function (todo) {
           res.json(todo.toJSON()); 
		});
	}, function(e) {
		res.status(400).json(e);
	});
};

/******************************************************************************************************
 Update a Record 
******************************************************************************************************/
module.exports.todosPut = function(req, res) {
    
    var where = {};

    // pick appropiate fields
    var body = business.cleanPost(req);
    
    // set the attributes to update
    var attributes = business.prepareForUpdate(req);
    
    // builds clause
    where = common.setClausePut(req);

    // find record on database, update record and return to client
	db.todo.findOne({
		where: where
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
};

/******************************************************************************************************
 Delete a Record 
******************************************************************************************************/
module.exports.todosDelete = function (req, res) {
    
    var where = {};
    
    // builds clause
    where = common.setClauseDelete(req);

    // delete record on database
    db.todo.destroy({
        where: where
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No record found with id'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
};
