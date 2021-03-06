module.exports = async (electionID, changes, { electionRepository }) => {
  const election = await electionRepository.get(electionID);
  Object.assign(election, changes);
  const result = await electionRepository.merge(election);
  return result;
};
