"use strict";
var db = require('../.././db.js');
var _ = require('underscore');

module.exports.ordersGetByUserId = function (req, res) {
    var query = req.query;
    var where = {
        userId: req.user.get('id')
    };
    
    if (query.hasOwnProperty('orderStatusId')) {
        where.orderStatusId = query.orderStatusId;
    }
    
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.order.findAll({
        where: where
    }).then(function (orders) {
        res.json(orders);
    }, function (e) {
        res.status(500).send();
    })
};

module.exports.ordersGetAll = function (req, res) {
    var query = req.query;
    var where = {};
    
    if (query.hasOwnProperty('orderStatusId')) {
        where.orderStatusId = query.orderStatusId;
    }
    
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.order.findAll({
        where: where
    }).then(function (orders) {
        res.json(orders);
    }, function (e) {
        res.status(500).send();
    })
};

module.exports.ordersGetById = function (req, res) {
    
    var orderId = parseInt(req.params.id, 10);
    
    db.order.findOne({
        where: {
            id: orderId
        }
    }).then(function (order) {
        if (!!order) {
            res.json(order.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    })
};

module.exports.ordersPost = function (req, res) {
    console.log(req.body);
    //remove unnecessary data
    var body = _.pick(req.body, 'orderStatusId', 'orderTypeId', 'deleted', 'description', 'dateOrdered', 'dateCompleted', 'createdBy', 'updatedBy');
    console.log(body);
    db.order.create(body).then(function (order) {
        req.user.addOrder(order).then(function () {
            return order.reload();
        }).then(function (order) {
            res.json(order.toJSON());
        });
    }, function (e) {
        res.status(400).json(e);

    });
};

module.exports.ordersPut = function (req, res) {
    var orderId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'orderStatusId', 'orderTypeId', 'deleted','description','dateOrdered','dateCompleted', 'createdBy','updatedBy');
    var attributes = {};
    
    if (body.hasOwnProperty('orderStatusId')) {
        attributes.orderStatusId = body.orderStatusId;
    }
    if (body.hasOwnProperty('orderTypeId')) {
        attributes.orderTypeId = body.orderTypeId;
    }
    if (body.hasOwnProperty('deleted')) {
        attributes.deleted = body.deleted;
    }
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
    if (body.hasOwnProperty('dateOrdered')) {
        attributes.dateOrdered = body.dateOrdered;
    }
    if (body.hasOwnProperty('dateCompleted')) {
        attributes.dateCompleted = body.dateCompleted;
    }
    if (body.hasOwnProperty('createdBy')) {
        attributes.createdBy = body.createdBy;
    }
    if (body.hasOwnProperty('updatedBy')) {
        attributes.updatedBy = body.updatedBy;
    }

    db.order.findOne({
        where: {
            id: orderId
        }
    }).then(function (order) {
        if (order) {
            order.update(attributes).then(function (order) {
                res.json(order.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
};

module.exports.ordersDelete = function (req, res) {
    
    var orderId = parseInt(req.params.id, 10);
    
    db.order.destroy({
        where: {
            id: orderId
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No Order found with id'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
};