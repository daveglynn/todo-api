/******************************************************************************************************
 business layer
******************************************************************************************************/
var _ = require('underscore');

module.exports = {
    
    setPost: function (req) {

        //clean post
        var body = _.pick(req.body, 'name', 'active', 'createdBy');
        
        //add createdBy
        body.createdBy = common.modelUserId(req);

        return body;
    },
    
    prepareForUpdate: function (body) {
        
        var attributes = {};
        if (body.hasOwnProperty('active')) {
            attributes.active = body.active;
        }
        if (body.hasOwnProperty('name')) {
            attributes.name = body.name;
        }
        if (body.hasOwnProperty('createdBy')) {
            attributes.tenantId = body.createdBy;
        }
        if (body.hasOwnProperty('updatedBy')) {
            attributes.tenantId = body.createdBy;
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

