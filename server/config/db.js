const { Sequelize } = require("sequelize");
const express = require('express');
const dotenv = require("dotenv");
const env = require('../env.js');

dotenv.config();
const sequelize = new Sequelize(
    env.DB_DATABASE,
    env.DB_USER,
    env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
});
sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    });

module.exports = sequelize;