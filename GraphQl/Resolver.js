const {
  addUser,
  userLogin,
  searchUser,
} = require("../Controllers/UserController");

module.exports = {
  Query: {
    search: (parent, args) => searchUser(args),
    login: (parent, args) => userLogin(args),
  },
  Mutation: {
    register: (parent, { userData }) => {
      return addUser(userData);
    },
    addMessage: (parent, { messageData }, { pubsub }) => {
      let newMessage = { ...messageData, id: Date.now() };
      pubsub.publish("MESSAGE_ADDED", { messageAdded: newMessage });
      return newMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("MESSAGE_ADDED"),
    },
  },
};
