const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const express = require("express");
const { connect, mongo_connect } = require("./src/config/db");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const client = require("prom-client");
const bodyParser = require("body-parser");

dotenv.config();

const port = process.env.PORT || 9000;
const app = express();

connect();
mongo_connect();
client.collectDefaultMetrics();

const fs = require("fs");
const typeDefs = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });
const resolvers = require("./resolvers");

const corsOptions = {
  origin: ["https://studio.apollographql.com", "http://localhost:3000"],
  credentials: true,
};

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000],
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.route?.path, code: res.statusCode });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(cors(corsOptions), bodyParser.json());

app.use(
  expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    if (req.headers) {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];

        try {
          const user = jwt.verify(token, process.env.TOKEN_SECRET);
          return { user };
        } catch (err) {
          return { user: null };
        }
      }
    }
    return { user: null };
  },
});

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(
      `Server running at http://localhost:${port}${server.graphqlPath}`
    );
  });
})();
