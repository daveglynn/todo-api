
/******************************************************************************************************
 import Required Modules
******************************************************************************************************/

var db = require('../.././db.js');
var _ = require('underscore');
var common = require('../business/common.business');
var table = 'todo';

/******************************************************************************************************
 Get All Records - Filtered by TenantId
******************************************************************************************************/
module.exports.todosGetAll = function (req, res) {
    
    var query = req.query;
    var where = {};
    
    //set query parameters    
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
    
    var query = req.query;
	var where = {
		userId: req.user.get('id')
	};
    
    //set query parameters   
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
    
    //get id from request
	var todoId = parseInt(req.params.id, 10);
    
    //find and return the records 
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
};

/******************************************************************************************************
 Insert a Record 
******************************************************************************************************/
module.exports.todosPost = function(req, res) {
    
    // pick appropiate fields
    //var body = _.pick(req.body, 'description', 'completed');
    var body = common.setBody(req, table);

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
    
    //get id from request
    var todoId = parseInt(req.params.id, 10);
    
    // pick appropiate fields
	var body = _.pick(req.body, 'description', 'completed');
    
    // set the attributes to update
    var attributes = {};
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
    
    // find record on database, update record and return to client
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
};

/******************************************************************************************************
 Delete a Record 
******************************************************************************************************/
module.exports.todosDelete = function (req, res) {
    
    //get id from request
    var todoId = parseInt(req.params.id, 10);
    
    // delete record on database
    db.todo.destroy({
        where: {
            id: todoId,
            userId: req.user.get('id')
        }
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
