const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbconfig');

const Club = sequelize.define('Club', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // avatar: {
    //     type: DataTypes.TEXT,
    //     unique: true,
    //     allowNull: false
    // },
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = Club;