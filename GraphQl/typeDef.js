const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    id: ID!
    username: String!
    status: Boolean
    createdAt: String!
    profilePicture: String!
    email: String!
  }
  type Message {
    id: String
    content: String!
    from: String!
    to: String!
  }
  type Auth {
    token: String
    user: User
  }
  input UserInput {
    username: String!
    password: String!
    profilePicture: String
    email: String!
  }
  input MessageInput {
    id: String
    content: String!
    from: String!
    to: String!
  }
  type Query {
    search(email: String!): User
    login(email: String!, password: String!): Auth
  }
  type Mutation {
    register(userData: UserInput): User
    addMessage(messageData: MessageInput): Message
  }
  type Subscription {
    userAdded: [User]
    messageAdded: Message
  }
`;
