const { Sequelize } = require("sequelize");
const { client } = require("../config/db");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

// Add Sequelize instance to the db object
db.Sequelize = Sequelize;
db.sequelize = client;

db.mongoose = mongoose;
// Import your models and attach them to the db object
db.User = require("./user");
db.UserProfile = require("./profile");
db.Loan = require("./loan");

module.exports = db;
