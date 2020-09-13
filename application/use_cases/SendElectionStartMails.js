const SendMail = require('./SendMail.js');
const environment = require('../../infrastructure/config/environment.js');

const _template = (title) => {
    const link = environment.frontend.server.votingEndpointURL;
    
    return `
    Dear Sir or Madam,<br>
    The election "${title} has just started.<br>
    To vote, please go to the <a href="${link}">page</a> and follow the instructions.<br>
    You will be notified about the final results with another mail message.<br>
    ---------------<br>
    Yours sincerely,<br>
    BlockVote, Ethereum-based voting application.`;
}

module.exports = async (electionID, { electionRepository }) => {
  const election = await electionRepository.get(electionID);
  const { title, participants } = election;

  const subject = `The "${title}" begins.`;
  const html = _template(title);  

  participants.forEach(async (p) => {
    await SendMail(p.email, subject, html);
  });

  return true;
};
