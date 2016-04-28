/******************************************************************************************************
 business layer
******************************************************************************************************/
var _ = require('underscore');

module.exports = {
    
    cleanPost: function (req) {
        
        return _.pick(req.body, 'name', 'active', 'createdBy');

    },
    
    prepareForUpdate: function (req) {
        
        var body = req.body;
        var attributes = {};
        if (body.hasOwnProperty('active')) {
            attributes.active = body.active;
        }
        if (body.hasOwnProperty('name')) {
            attributes.name = body.name;
        }
        return attributes;

    },
    
    setClauseQuery: function (query) {
        
        var where = {};

        //set query parameters   
        if (query.hasOwnProperty('active') && query.active === 'true') {
            where.active = true;
        } else if (query.hasOwnProperty('active') && query.active === 'false') {
            where.active = false;
        }
        if (query.hasOwnProperty('q') && query.q.length > 0) {
            where.name = {
                $like: '%' + query.q + '%'
            };
        }
        return where;

    }
 


};

