const SendMail = require('./SendMail.js');

const _template = (title, userMail, candidates) => {
  const htmlCandiates = candidates.map(candidate => {
    return candidate.name + ' ' + candidate.surname + ' ' + candidate.votes;
  }).join('<br/>');

  return `
    <p>
      Dear Sir or Madam,<br>    
      The election "${title}", organized by ${userMail}, has finished.<br>    
      The results are:<br>
      ${htmlCandiates}<br>
      ---------------<br>
      Yours sincerely,<br>
      BlockVote, Ethereum-based voting application.
    </p>
  `;
}

// TODO: Get the candidates from the different repo or different use case.
module.exports = async (userMail, electionID, candidates, { electionRepository }) => {
  const election = await electionRepository.get(electionID);
  const { title, participants } = election;

  const subject = `The "${title}" election final results.`;
  const html = _template(title, userMail, candidates);

  participants.forEach(async (p) => {
    await SendMail(p.email, subject, html);
  });

  // TODO; Error handling
  return true;
};
