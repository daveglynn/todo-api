/******************************************************************************************************
 business layer
******************************************************************************************************/
var _ = require('underscore');
var common = require('../business/common.business');

module.exports = {
    
    setPost: function (req) {
        
        //clean post
        var body = _.pick(req.body, 'description', 'completed');
        
        //add tenant
        body.tenantId = common.modelTenantId(req);

        return body;

    },

    prepareForUpdate: function (body) {
        
        var attributes = {};
        if (body.hasOwnProperty('completed')) {
            attributes.completed = body.completed;
        }
        if (body.hasOwnProperty('description')) {
            attributes.description = body.description;
        }
        if (body.hasOwnProperty('tenantId')) {
            attributes.tenantId = body.tenantId;
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

