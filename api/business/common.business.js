/******************************************************************************************************
 common business layer
******************************************************************************************************/
var _ = require('underscore');

module.exports = {
    

    setClauseGetAll: function (req) {

        var where = {};
        return where;

    },
    
    setClauseGetByUserId: function (req) {
        
        var where = {
            userId: req.user.get('id')
        };
        return where;

    },
    
    setClauseGetById: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;

    },
    
    setClausePut: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;

    },
    
    setClauseDelete: function (req) {
        
        var id = parseInt(req.params.id, 10);
        var where = {
            id: id,
            userId: req.user.get('id')
        };
        return where;

    },
    
    setUserBy: function (req) {
        
        return req.user.get('id');

    }
};
 