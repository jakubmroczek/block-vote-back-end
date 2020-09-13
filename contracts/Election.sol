pragma solidity ^0.6.10;

pragma experimental ABIEncoderV2;

contract Election {

  struct Candidate {
    string name;
    string surname;
    uint votes;
  }

  struct CandidateInput {
    string name;
    string surname;
  }

  function isVoterRegistered(address voter) view public returns(bool) {
    for (uint i = 0; i < m_registeredVoters.length; i++) {
      if (m_registeredVoters[i] == voter) {
        return true;
      }
    }
    return false;
  }

  function hasVoterAlreadyVoted(address voter) view public returns(bool) {
    return m_registeredVotersWhoVoted[voter];
  }

 modifier registeredVoter {
   require(isVoterRegistered(msg.sender), "You are not allowed to participate in the voting as your public key was not registered");
   _;
 }

 modifier voterDidNotVote {
   require(!hasVoterAlreadyVoted(msg.sender), "You have already voted");
   _;
 }

  function vote(uint index) public  registeredVoter voterDidNotVote {
      m_candidates[index].votes++;
      m_numberOfCastedVotes++;
      voterVoted(msg.sender);
  }

  function getCandidates() public view returns (Candidate[] memory) {
    return  m_candidates;
  }

  function getTitle() public view returns(string memory) {
    return  m_title;
  }

  function getNumberOfCastedVotes() public view returns(uint) {
    return m_numberOfCastedVotes;
  }

  function getNumberOfEligibleVoters() public view returns(uint) {
    return m_numberOfEligibleVoters;
  }

 Candidate[] public m_candidates;
 address[] m_registeredVoters;
 mapping(address => bool) m_registeredVotersWhoVoted;
 string m_title;
 uint m_numberOfCastedVotes;
 uint m_numberOfEligibleVoters;

  constructor(string memory title, CandidateInput[] memory candidates, address[] memory registeredVoters) public {
    for (uint i = 0; i < candidates.length; i++) {
      // 0 as no one has any votes at the beginning
      m_candidates.push(Candidate(candidates[i].name, candidates[i].surname, 0));
    }

    for (uint i = 0; i < registeredVoters.length; i++) {
      m_registeredVoters.push(registeredVoters[i]);
    }

    m_title = title;

    m_numberOfEligibleVoters = registeredVoters.length;
  }

  function voterVoted(address voter) private {
     m_registeredVotersWhoVoted[voter] = true;
  }

}
