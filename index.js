const { ApolloServer, PubSub } = require("apollo-server");
const pubsub = new PubSub();
const typeDefs = require("./GraphQl/typeDef");
const resolvers = require("./GraphQl/Resolver");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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
const server = new ApolloServer({
  introspection: true,
  subscriptions: {
    onConnect: () => console.log("user connected"),
  },
  typeDefs,
  resolvers,
  context: async (context) => {
    let token;
    if (context.req && context.req.headers.authorization) {
      token = context.req.headers.authorization;
    } else if (context.connection && context.connection.context.Authorization) {
      token = context.connection.context.Authorization;
    }
    if (token) {
      const { userId } = await jwt.verify(
        authorization,
        process.env.SECRET_KEY
      );
      context.userId = userId;
    }
    context.pubsub = pubsub;
    return context;
  },
});

server.listen({ port: process.env.port || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
