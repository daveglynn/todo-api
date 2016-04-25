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
    
    setClauseQuery: function (query, where) {
        
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

