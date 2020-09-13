const Voter = require('../../domain/Voter.js');

function isSecretTokenValid(secretToken, election) {
  const { secretTokens } = election;
  const match = secretTokens.find(token => token === secretToken);
  return match !== undefined;
}

module.exports = async (secretToken, publicKey, id, { voterRepository, electionRepository }) => {
  const election = await electionRepository.get(id);

  if (!isSecretTokenValid(secretToken, election)) {
    throw "Invalid secret token, rejecting public key";
  }

  const index = election.secretTokens.indexOf(secretToken);
  if (index > -1) {
    election.secretTokens.splice(index, 1);
  }
  election.publicKeys.push(publicKey);

  await electionRepository.merge(election);

  let voter = await voterRepository.findByPublicKey(publicKey);

  if (voter === null) {
    const electionIDs = [id];
    voter = new Voter(null, publicKey, electionIDs);  
    await voterRepository.persist(voter);
  } else {
    voter.electionIDs.push(id);
    await voterRepository.merge(voter);
  }

  return true; 
};
