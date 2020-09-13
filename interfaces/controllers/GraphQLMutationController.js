/* eslint-disable no-underscore-dangle */
const CreateElection = require('../../application/use_cases/CreateElection.js');
const UpdateElection = require('../../application/use_cases/UpdateElection.js');
const RegisterPublicKey = require('../../application/use_cases/RegisterPublicKey.js');
const StartPublicKeyRegistration = require('../../application/use_cases/StartPublicKeyRegistration.js');
const CompileElectionSmartContract = require('../../application/use_cases/CompileElectionSmartContract.js');
const FinishElection = require('../../application/use_cases/FinishElection.js');
const SendRegisterationMail = require('../../application/use_cases/SendRegisterationMail.js');
const SendElectionStartMails = require('../../application/use_cases/SendElectionStartMails.js');
const GetUserElection = require('../../application/use_cases/GetUserElection.js');
const { mustBeSignedIn, mustOwnElection } = require('../../infrastructure/security/GraphQLAuthentication.js');

async function _createElection(_1, _2, { user, serviceLocator }) {
  const election = await CreateElection(user, serviceLocator);
  return election;
}

async function _updateElection(_1, { id, changes }, { serviceLocator }) {
  const election = await UpdateElection(id, changes, serviceLocator);
  return election;
}

async function _registerPublicKey(_1, { id, secretToken, publicKey }, { serviceLocator }) {
  const result = await RegisterPublicKey(secretToken, publicKey, id, serviceLocator);
  return result;
}

async function _startPublicKeyRegistration(_1, _2, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  
  const { email } = user;
  const { id } = election;
  
  await StartPublicKeyRegistration(id, serviceLocator);
  await SendRegisterationMail(email, id, serviceLocator);

  return true;
}

async function _startElection(_1, { address }, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  const { id, smartContract } = election;

  smartContract.address = address;
  const changes = { status: 'Deployed', smartContract };

  await UpdateElection(id, changes, serviceLocator);
  await SendElectionStartMails(id, serviceLocator);

  return true;
}

async function _compileElectionSmartContract(_1, _2, { user, serviceLocator }) {
  const election = await GetUserElection(user, serviceLocator);
  const { id } = election;
  
  await CompileElectionSmartContract(id, serviceLocator);
  
  return true;
}

async function _finishElection(_1, _2, { user, serviceLocator }) {
  const result = await FinishElection(user, serviceLocator);
  return result;
}

module.exports = {
  createElection: mustBeSignedIn(_createElection),
  updateElection: mustBeSignedIn(mustOwnElection(_updateElection)),
  registerPublicKey: _registerPublicKey,
  startPublicKeyRegistration: mustBeSignedIn(_startPublicKeyRegistration),
  startElection: mustBeSignedIn(_startElection),
  compileElectionSmartContract: mustBeSignedIn(_compileElectionSmartContract),
  finishElection: mustBeSignedIn(_finishElection),
};
