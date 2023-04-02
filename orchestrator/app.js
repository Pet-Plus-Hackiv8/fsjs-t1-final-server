if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ApolloServer} = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { petTypeDefs, petResolvers } = require("./petSchema");

const server = new ApolloServer({
  typeDefs: [petTypeDefs],
  resolvers: [petResolvers],
  introspection: true,
});


startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});


