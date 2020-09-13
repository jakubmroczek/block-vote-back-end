async function removeElectionFromTheVoters(election, voterRepository) {
  const { id, publicKeys } = election;

  for (let index = 0; index < publicKeys.length; index += 1) {
    const publicKey = publicKeys[index];
    const voter = await voterRepository.findByPublicKey(publicKey);

    const { electionIDs } = voter;

    // Removing election from the list
    const electionIdIndex = electionIDs.indexOf(id);
    if (electionIdIndex >= 0) {
      electionIDs.splice(electionIdIndex, 1);
    }

    voter.electionIDs = electionIDs;
    await voterRepository.merge(voter);
  }
}

module.exports = async (user, { userRepository, voterRepository, electionRepository, blockchainRepository }) => {
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionID } = domainUser;
  
  const election = await electionRepository.get(electionID);
  const { smartContract } = election;
  const { abi, address } = smartContract;

  domainUser.finishedElectionIDs.push(electionID);
  domainUser.electionID = null;

  await userRepository.merge(domainUser);
  
  election.status = 'Finished';

  await electionRepository.merge(election);

  // Removing the electionIDs from the public keys.
  await removeElectionFromTheVoters(election, voterRepository);

  const SendFinishMail = require('./SendFinishMail.js');

  const electionSmartContract = await blockchainRepository.findByAddress(address, abi);
  const { candidates } = electionSmartContract;
  
  await SendFinishMail(email, electionID, candidates, { electionRepository });

  return true;
};
