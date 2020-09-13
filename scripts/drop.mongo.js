/* global db print */
/* eslint no-restricted-globals: "off" */
db.users.remove({});
db.elections.remove({});
db.voters.remove({});

db.users.createIndex({ username: 1 });
