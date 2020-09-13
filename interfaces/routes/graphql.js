const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const environment = require('../../infrastructure/config/environment.js');
const { publicKeyScalarType, secretTokenScalarType } = require('./types/scalarTypes.js');
const VerifyAccessToken = require('../../application/use_cases/VerifyAccessToken.js');

const GraphQLQuery = require('../controllers/GraphQLQueryController.js');
const GraphQLMutation = require('../controllers/GraphQLMutationController.js');

function getContext({ req }) {
  const token = req.cookies.jwt;
  const { serviceLocator } = req.app;

  if (!token) {
    return { isLoggedIn: false, serviceLocator };
  }

  try {
    const user = VerifyAccessToken(token, serviceLocator);
    return { user, serviceLocator };
  } catch (error) {
    return { isLoggedIn: false };
  }
}

const resolvers = {
  PublicKey: publicKeyScalarType,
  SecretToken: secretTokenScalarType, 
  Query: GraphQLQuery,
  Mutation: GraphQLMutation,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    console.log(error.extensions.exception.stacktrace);
    return error;
  },
});

function register(app) {
  const enableCors = (environment.server.enableCors || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { register };
