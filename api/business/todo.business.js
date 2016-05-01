/******************************************************************************************************
 business layer
******************************************************************************************************/
"use strict";
var _ = require('underscore');
var common = require('../business/common.business');

module.exports = {
    
    setPost: function (req,mode) {
        
        //clean post
        var body = _.pick(req.body, 'description', 'completed');
        
        //add tenant
        body.tenantId = common.modelTenantId(req);
        
        //add createdBy,updatedBy
        if (mode = 'C') {
            body.createdBy = common.modelUserId(req);
        } else {
            body.updatedBy = common.modelUserId(req);
        }
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
        if (body.hasOwnProperty('createdBy')) {
            attributes.tenantId = body.createdBy;
        }
        if (body.hasOwnProperty('updatedBy')) {
            attributes.tenantId = body.createdBy;
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

