module.exports = async (publicKey, { voterRepository, electionRepository }) => {
  const voter = await voterRepository.findByPublicKey(publicKey);
  const elections = [];

  if (voter === null) {
    return elections;
  }

  const { electionIDs } = voter;

  for (let index = 0; index < electionIDs.length; index += 1) {
    const id = electionIDs[index];
    const election = await electionRepository.get(id);

    if (election !== null
      && election.status === 'Deployed') {
      elections.push(election);
    }
  }

  return elections;
};
