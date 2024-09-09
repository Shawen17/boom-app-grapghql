const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logger = require("../../logger");

dotenv.config();

DB_USER = process.env.DB_USER;
PASSWORD = process.env.PASSWORD;
CLUSTERNAME = process.env.CLUSTERNAME;

mongoose.connect(
  `mongodb+srv://${DB_USER}:${PASSWORD}@${CLUSTERNAME}.jzsljb4.mongodb.net/user_details`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Adjust the pool size as needed
    serverSelectionTimeoutMS: 5000, // Timeout for initial server selection
    socketTimeoutMS: 45000, // Timeout for socket operations
    family: 4, // Use IPv4, skip trying IPv6
  }
);

mongoose.connection.setMaxListeners(50);

mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose disconnected from MongoDB");
});

mongoose.set("debug", function (collectionName, method, query, doc) {
  const start = process.hrtime();

  // Ensure only one commandStarted listener is added
  const commandStartedListener = (event) => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1e3 + nanoseconds * 1e-6;

    if (duration > 100) {
      // Log slow queries
      logger.warn(
        `Slow query detected: ${collectionName}.${method} took ${duration}ms`,
        { query, doc }
      );
    }
  };
  mongoose.connection.on("commandStarted", commandStartedListener);
  mongoose.connection.removeListener("commandStarted", commandStartedListener);
});

MYSQL_USER = process.env.MYSQL_USER;
MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
MYSQL_HOST = process.env.MYSQL_HOST;
MYSQL_PORT = process.env.MYSQL_PORT || 3306;

const client = new Sequelize("marz", MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mariadb",
});

async function connect(retries = 5, delay = 3000) {
  let delayFactor = 1;

  while (retries > 0) {
    try {
      await client.authenticate(); // Assuming db.connect returns a Promise
      logger.info("Database connected successfully.");
      return;
    } catch (error) {
      const delayTime = delay * delayFactor;
      logger.warn(
        `Connection failed: ${error.message}, retrying in ${
          delayTime / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayTime));
      delayFactor += 1;
      retries -= 1;
    }
  }

  logger.error("Could not connect to the database after several attempts");
}

module.exports = { connect, client, mongoose };
