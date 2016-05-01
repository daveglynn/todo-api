/******************************************************************************************************
 business layer
******************************************************************************************************/
"use strict";
var _ = require('underscore');
var common = require('../business/common.business');

/******************************************************************************************************
 Fetch a Record
******************************************************************************************************/
 
module.exports = {

    setPost: function (req, mode) {
        
        //clean post
        var body = _.pick(req.body, 'email', 'password', 'tenantId', 'role');
        
        //add tenant
        body.tenantId = null;
        
        //add createdBy
        if (mode = 'C') {
            body.createdBy = null;
        } else {
            body.updatedBy = common.modelUserId(req);
        }
        return body;

    },

};

