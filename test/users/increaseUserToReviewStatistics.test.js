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

  it('should update statistics if document exists', async () => {
    existsStub = sinon.stub().returns(true);
    dataStub = sinon.stub().returns({ value: 5 });
    getStub.resolves({
      exists: existsStub(),
      data: dataStub,
    });

    const wrappedFunction = functions.wrap(increaseUserToReviewStatistics);
    await wrappedFunction({});

    assert.strictEqual(docStub.calledWith(Statistics.usersToReview), true);
    assert.strictEqual(getStub.calledOnce, true);
    assert.strictEqual(updateStub.calledOnce, true);
    const updatedData = updateStub.getCall(0).args[0];
    assert.strictEqual(updatedData.value, 6);
    assert.strictEqual(typeof updatedData.modified, 'number');
  });

});