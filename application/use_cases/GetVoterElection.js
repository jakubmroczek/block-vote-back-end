module.exports = async (id, { electionRepository }) => {
  const election = await electionRepository.get(id);

  if (election.status !== 'Deployed') {
    return null;
  }

  return election;
};
