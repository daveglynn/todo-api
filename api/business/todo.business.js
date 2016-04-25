/******************************************************************************************************
 business layer
******************************************************************************************************/
var _ = require('underscore');

module.exports = {
    
    cleanPost: function (req) {
        
        return _.pick(req.body, 'description', 'completed');
    
    },
    prepareForUpdate: function (req) {
        
        var body = req.body;
        var attributes = {};
        
        if (body.hasOwnProperty('completed')) {
            attributes.completed = body.completed;
        }
        if (body.hasOwnProperty('description')) {
            attributes.description = body.description;
        }
        return attributes;
    },
    buildlClauseGetAll: function (req) {
        
        var query = req.query;
        var where = {};
        
        where = this.buildClauseCommon(query, where)
        return where;
    },
    buildlClauseGetByUserId: function (req) {
        
        var query = req.query;

        var where = {
            userId: req.user.get('id')
        };
        
        where = this.buildClauseCommon(query, where)
        return where;
    },
    buildlClauseGetById: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var query = req.query;
        
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;
    },
    buildClausePut: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var query = req.query;
        
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;
    },
    buildClauseDelete: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var query = req.query;
        
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;
    },
    buildClauseCommon: function (query, where) {
        
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
        return where;
    }
};

