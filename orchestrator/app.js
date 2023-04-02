// const { ApolloServer } = require("@apollo/server")
// // const fastify = require("fastify")()
// const { startStandaloneServer } = require("@apollo/server/standalone");
// const { userTypeDefs, userResolvers } = require("./schemas/users");
// import name from 'module';


import { ApolloServer } from "apollo-server-express";
import express from "express";
import graphqlUploadExpress  from "graphql-upload/graphqlUploadExpress.mjs";
import { userTypeDefs, userResolvers } from "./schemas/users.js";

const app = express();

const server = new ApolloServer({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
  uploads: false // Disable the built-in file handling of Apollo Server
});

async function startApolloServer() {
  await server.start();

  // Add the graphqlUploadExpress middleware
  app.use(graphqlUploadExpress());

  // Apply the Apollo Server middleware to the Express app
  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: process.env.PORT || 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
