"use strict";
var _ = require('underscore');
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        }
     },{
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.omit(json, 'tenantId');
            }
        }

	});
};