const generator = require('generate-password');

function generateSecretTokens(quantity) {
  let i = quantity;
  const secretTokens = [];
  while (i > 0) {
    const secretToken = generator.generate({
      length: 32,
      numbers: true,
    });
    const index = secretTokens.indexOf(secretToken);
    if (index === -1) {
      i -= 1;
      secretTokens.push(secretToken);
    }
  }
  return secretTokens;
}


module.exports = async (electionID, { electionRepository }) => {
  const election = await electionRepository.get(electionID);

  const { participants } = election;
  const { length } = participants;

  election.status = 'Registration';
  election.secretTokens = generateSecretTokens(length);

  const result = await electionRepository.merge(election);

  return result;
};
