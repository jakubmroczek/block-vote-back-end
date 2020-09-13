module.exports = {
  async init() {
    // Connecting to the MongoDB database.
    require('../orm/mongoose/mongoose');
  }
};
