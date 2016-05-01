"use strict";

var db = require('../.././db.js');

/******************************************************************************************************
 common business layer
******************************************************************************************************/
var _ = require('underscore');

module.exports = {
    

    setClauseAll: function (req,where ) {

        return where;

    },

    setClauseTenantId: function (req, where) {

        where.tenantId = this.modelTenantId(req);
        return where;

    },

    
    setClauseUserId: function (req, where ) {
        
        where. userId = req.user.get('id')
        return where;

    },
    
     
    setClauseIdUserId: function (req, where) {
        
        where.id = parseInt(req.params.id, 10);
        where.userId = req.user.get('id')
        return where;

    },
    
    setClauseId: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var where = {
            id: id
        };
        return where;

    },
    
    modelUserId: function (req) {
        
        return req.user.get('id');

    },
    
    modelTenantId: function (req) {
        
        return req.user.get('tenantId');

    },

    setAttributes: function (req) {
    
        var attributes = {
            exclude: ['tenantId']
        };
        
        return attributes;

}

};
 