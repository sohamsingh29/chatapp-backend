const typeDefs = require("./GraphQl/typeDef");
const resolvers = require("./GraphQl/Resolver");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const { makeExecutableSchema } = require("graphql-tools");
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("error", () => {
  console.log("unable to connect to mongodb");
});

const PORT = 4000;

var app = express();

app.use(
  "/api/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: { subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions` },
  })
);
app.get("/api/", (req, res) => res.send("hello"));
const ws = createServer(app);

ws.listen(PORT, () => {
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: "/subscriptions",
    }
  );
});
module.exports = ws;
