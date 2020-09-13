/* eslint-disable no-underscore-dangle */
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
const GetVoterElection = require('../../application/use_cases/GetVoterElection.js');
const ListVoterElections = require('../../application/use_cases/ListVoterElections.js');
const { mustBeSignedIn } = require('../../infrastructure/security/GraphQLAuthentication.js');

async function _getUserElection(_1, _2, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  return election;
}

async function _getVoterElection(_1, { id }, { serviceLocator }) {
  const election = await GetVoterElection(id, serviceLocator);
  return election;
}

async function _listVoterElections(_1, { publicKey }, { serviceLocator }) {
  const elections = await ListVoterElections(publicKey, serviceLocator);
  return elections;
}

module.exports = {
  getUserElection: mustBeSignedIn(_getUserElection),
  getVoterElection: _getVoterElection,
  listVoterElections: _listVoterElections,
};
