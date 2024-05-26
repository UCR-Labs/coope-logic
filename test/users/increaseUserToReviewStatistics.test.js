const functions = require('firebase-functions-test')();
const admin = require('firebase-admin');
const assert = require('assert');
const sinon = require('sinon');
const { increaseUserToReviewStatistics } = require('../../src/users/increaseUserToReviewStatistics');
const { FirestoreCollections, Statistics } = require('../../src');

describe('increaseUserToReviewStatistics', () => {
  let firestoreStub, docStub, getStub, updateStub, setStub, existsStub, dataStub;

  beforeEach(() => {
    sinon.stub(admin, 'initializeApp');

    setStub = sinon.stub().resolves();
    updateStub = sinon.stub().resolves();
    getStub = sinon.stub();
    docStub = sinon.stub().returns({
      get: getStub,
      update: updateStub,
      set: setStub,
    });
    firestoreStub = sinon.stub(admin, 'firestore').get(() => {
      return sinon.stub().returns({
        collection: sinon.stub().returns({
          doc: docStub
        })
      });
    });
  });



});