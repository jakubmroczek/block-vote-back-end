const CreateUser = require('../../application/use_cases/CreateUser.js');

module.exports = {

  async createUser(request) {
    const { serviceLocator } = request.app;
    const { email } = request.payload;

    const user = await CreateUser(email, serviceLocator);

    return serviceLocator.userSerializer.serialize(user);
  },

};
