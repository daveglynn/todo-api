/******************************************************************************************************
 import Required Modules
******************************************************************************************************/
var _ = require('underscore');

module.exports = {

    setBody: function (req, table) {
        switch (table) {
            case 'todo': return _.pick(req.body, 'description', 'completed');
            case 'user': return _.pick(req.body, 'description', 'completed');
            default: return "";
        }
    }
};
 