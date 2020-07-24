module.exports = class {
  constructor(address, title, candidates, numberOfCastedVotes, numberOfEligibleVoters) {
    this.address = address;
    this.title = title;
    this.candidates = candidates;
    this.numberOfCastedVotes = numberOfCastedVotes;
    this.numberOfEligibleVoters = numberOfEligibleVoters;
  }
};
