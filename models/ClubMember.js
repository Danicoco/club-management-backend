const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbconfig');

const ClubMemeber = sequelize.define('ClubMemeber', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

module.exports = ClubMemeber;