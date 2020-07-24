const SendMail = require('./SendMail.js');
const environment = require('../../infrastructure/config/environment.js');

const htmlTemplate = (userMail, electionTitle, link, secretToken) => `
     <p>
      Dear Sir or Madam,<br>    
      The user, whose email address is ${userMail}, invites you to register in the election "${electionTitle}".<br>    
      To register, please go to the <a href="${link}">page</a> and follow the instructions.<br> 
      <br>    
      Your secret token is: "${secretToken}".<br>    
      Please, do not share it with anyone.<br>
      You will be notified when the election starts with another mail message.<br>
      <br>    
      ---------------<br>
      Yours sincerely,<br>
      BlockVote, Ethereum-based voting application.
    </p>
`;

module.exports = async (userMail, electionID, { electionRepository }) => {
  // TODO: Error handlind
  const election = await electionRepository.get(electionID);

  const { id: _id, title, participants, secretTokens } = election;

  const link = environment.frontend.server.registrationEndpointURL + '/' + _id;

  if (participants.length !== secretTokens.length) {
    // TODO: Handle the error if there is not enough public keys
    throw 'Not enough secret tokens generated for the public key';
  }

  const { length } = participants;
  const subject = `Register in "${title}"`;

  for (let i = 0; i < length; i += 1) {
    const { email } = participants[i];
    const secretToken = secretTokens[i];
    const html = htmlTemplate(userMail, title, link, secretToken);

    await SendMail(email, subject, html);
  }

  // TODO: Fix this, introducde better erorr handling
  return true;
};
