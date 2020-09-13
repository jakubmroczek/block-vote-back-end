require('dotenv').config();
const constants = require('./constants');

module.exports = (() => {
  const environment = {
    database: {
      dialect: constants.SUPPORTED_DATABASE.MONGO,
      url: process.env.DB_URL,
    },

    server: {
      port: process.env.API_SERVER_PORT,
      enableCors: process.env.ENABLE_CORS,
    },

    frontend: {
      server: {
        registrationEndpointURL: process.env.FRONT_END_SERVER_REGISTRATION_ENDPOINT,
        votingEndpointURL: process.env.FRONT_END_SERVER_VOTING_ENDPOINT,
      },
    },

    mail: {
      service: constants.SUPPORTED_MAIL_SERVICE.GMAIL,
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASSWORD,
    },

    blockchain: {
      httpProvider: {
        url: process.env.BLOCKCHAIN_HTTP_PROVIDER_URL,
      },
    },
  };

  return environment;
})();
