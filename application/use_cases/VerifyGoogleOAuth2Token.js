const { OAuth2Client } = require('google-auth-library');

module.exports = async (googleToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({ idToken: googleToken });
  const payload = ticket.getPayload();
  const { email } = payload;
  const credentials = { isLoggedIn: true, email };
  return credentials;
};
