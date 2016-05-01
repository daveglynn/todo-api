"use strict";
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('order', {
		orderStatusId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: null
        },
        orderTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        deleted: {
            type: DataTypes.BOOLEAN,
		    allowNull: false,
            defaultValue: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 250]
            }
        },        
        dateOrdered: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null
        },
        dateCompleted: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
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
        },
	});
};