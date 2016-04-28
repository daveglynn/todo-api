
/******************************************************************************************************
 import Required Modules
******************************************************************************************************/

var db = require('../.././db.js');
var _ = require('underscore');
var common = require('../business/common.business');
var business = require('../business/tenant.business');

/******************************************************************************************************
 Get All Records 
******************************************************************************************************/
module.exports.tenantsGetAll = function (req, res) {
    
    var where = {};
    
    // builds clause
    where = common.setClauseAll(req);
    where = business.setClauseQuery(req.query, where);
    
    //find and return the records    
    db.tenant.findAll({
        where: where
    }).then(function (tenants) {
        res.json(tenants);
    }, function (e) {
        res.status(500).send();
    })
};
 
/******************************************************************************************************
 Get a Record created by Id 
******************************************************************************************************/
module.exports.tenantsGetById = function (req, res) {
    
    var where = {};
    
    // builds clause
    where = common.setClauseId(req);
    
    //find and return the records 
    db.tenant.findOne({
        where: where
    }).then(function (tenant) {
        if (!!tenant) {
            res.json(tenant.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    })
};

/******************************************************************************************************
 Insert a Record 
******************************************************************************************************/
module.exports.tenantsPost = function (req, res) {
    
    // add createdBy
    req.body.createdBy = common.modelUserId(req);
    
    // pick appropiate fields
    var body = business.cleanPost(req);
    
    // create record on database, refresh and return local record to client
    db.tenant.create(body).then(function (tenant) {
        res.json(tenant.toJSON())
    }, function (e) {
        res.status(400).json(e);
    });
};



/******************************************************************************************************
 Update a Record 
******************************************************************************************************/
module.exports.tenantsPut = function (req, res) {
    
    var where = {};
    
    // pick appropiate fields
    var body = business.cleanPost(req);
    
    // set the attributes to update
    var attributes = business.prepareForUpdate(req);
    
    // builds clause
    where = common.setClauseId(req);
    
    // find record on database, update record and return to client
    db.tenant.findOne({
        where: where
    }).then(function (tenant) {
        if (tenant) {
            tenant.update(attributes).then(function (tenant) {
                res.json(tenant.toJSON());
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

/******************************************************************************************************
 Delete a Record 
******************************************************************************************************/
module.exports.tenantsDelete = function (req, res) {
    
    var where = {};
    
    // builds clause
    where = common.setClauseId(req);
    
    // delete record on database
    db.tenant.destroy({
        where: where
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
