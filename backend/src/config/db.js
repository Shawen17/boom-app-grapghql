const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config();

DB_USER = process.env.DB_USER;
PASSWORD = process.env.PASSWORD;
CLUSTERNAME = process.env.CLUSTERNAME;

const uri = `mongodb+srv://${DB_USER}:${PASSWORD}@${CLUSTERNAME}.jzsljb4.mongodb.net/?retryWrites=true&w=majority&appName=shawenCluster`;

const mongo_client = new MongoClient(uri);

MYSQL_USER = process.env.MYSQL_USER;
MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
MYSQL_HOST = process.env.MYSQL_HOST;
MYSQL_PORT = process.env.MYSQL_PORT || 3306;

const client = new Sequelize("marz", MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mariadb",
});

async function mongo_connect() {
  try {
    mongo_client.connect();
    const db = mongo_client.db("user_details");
    const collection = db.collection("users");
    const indexesToCreate = [
      { key: { "profile.email": 1 } },
      { key: { "profile.firstName": 1 } },
      { key: { "profile.lastName": 1 } },
      { key: { "profile.userName": 1 } },
      { key: { "profile.status": 1 } },
      { key: { "organization.orgname": 1 } },
      { key: { "organization.sector": 1 } },
    ];

    const indexExists = async (collection, field) => {
      const indexes = await collection.indexes();
      return indexes.some((index) => index.key.hasOwnProperty(field));
    };

    const fieldsToCheck = [
      "profile.email",
      "profile.firstName",
      "profile.lastName",
      "profile.userName",
      "profile.status",
      "organization.orgName",
      "organization.sector",
    ];

    const indexesNeeded = [];

    for (const [index, field] of fieldsToCheck.entries()) {
      const exists = await indexExists(collection, field);
      if (!exists) {
        indexesNeeded.push(indexesToCreate[index]);
      }
    }

    // Create indexes if necessary
    if (indexesNeeded.length > 0) {
      await collection.createIndexes(indexesNeeded);
      console.log("Indexes created:", indexesNeeded);
    } else {
      console.log("All indexes already exist.");
    }
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error while creating indexes:", err);
    console.error("Error connecting to MongoDB:", error);
  }
}

async function connect(retries = 5, delay = 3000) {
  let delayFactor = 1;

  while (retries > 0) {
    try {
      await client.authenticate(); // Assuming db.connect returns a Promise
      console.log("Database connected successfully.");
      return;
    } catch (error) {
      const delayTime = delay * delayFactor;
      console.log(
        `Connection failed: ${error.message}, retrying in ${
          delayTime / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayTime));
      delayFactor += 1;
      retries -= 1;
    }
  }

  throw new Error("Could not connect to the database after several attempts");
}

module.exports = { connect, client, mongo_connect };
