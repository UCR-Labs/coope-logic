const functions = require('firebase-functions-test')();
const admin = require('firebase-admin');
const assert = require('assert');
const sinon = require('sinon');
const { increaseUserToReviewStatistics, decreaseUserToReviewStatistics } = require('../../src/users/user_management');
const { FirestoreCollections, Statistics } = require('../../src/models');

describe('UserToReviewStatistics', () => {
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

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    functions.cleanup();
  });

  it('should update statistics if document exists on creation', async () => {
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

  it('should set statistics if document does not exist on creation', async () => {
    existsStub = sinon.stub().returns(false);
    getStub.resolves({
      exists: existsStub(),
    });

    const wrappedFunction = functions.wrap(increaseUserToReviewStatistics);
    await wrappedFunction({});

    assert.strictEqual(docStub.calledWith(Statistics.usersToReview), true);
    assert.strictEqual(getStub.calledOnce, true);
    assert.strictEqual(setStub.calledOnce, true);
    const setData = setStub.getCall(0).args[0];
    assert.strictEqual(setData.value, 1);
    assert.strictEqual(setData.label, FirestoreCollections.usersToReview);
    assert.strictEqual(typeof setData.modified, 'number');
  });

  it('should update statistics if document exists on deletion', async () => {
    existsStub = sinon.stub().returns(true);
    dataStub = sinon.stub().returns({ value: 5 });
    getStub.resolves({
      exists: existsStub(),
      data: dataStub,
    });

    const wrappedFunction = functions.wrap(decreaseUserToReviewStatistics);
    await wrappedFunction({});

    assert.strictEqual(docStub.calledWith(Statistics.usersToReview), true);
    assert.strictEqual(getStub.calledOnce, true);
    assert.strictEqual(updateStub.calledOnce, true);
    const updatedData = updateStub.getCall(0).args[0];
    assert.strictEqual(updatedData.value, 4);
    assert.strictEqual(typeof updatedData.modified, 'number');
  });

  it('should set statistics if document does not exist on deletion', async () => {
    existsStub = sinon.stub().returns(false);
    getStub.resolves({
      exists: existsStub(),
    });

    const wrappedFunction = functions.wrap(decreaseUserToReviewStatistics);
    await wrappedFunction({});

    assert.strictEqual(docStub.calledWith(Statistics.usersToReview), true);
    assert.strictEqual(getStub.calledOnce, true);
    assert.strictEqual(setStub.calledOnce, true);
    const setData = setStub.getCall(0).args[0];
    assert.strictEqual(setData.value, 1);
    assert.strictEqual(setData.label, FirestoreCollections.usersToReview);
    assert.strictEqual(typeof setData.modified, 'number');
  });

  it('should set statistics value to 0 if it is already 0 on deletion', async () => {
    existsStub = sinon.stub().returns(true);
    dataStub = sinon.stub().returns({ value: 0 });
    getStub.resolves({
      exists: existsStub(),
      data: dataStub,
    });

    const wrappedFunction = functions.wrap(decreaseUserToReviewStatistics);
    await wrappedFunction({});

    assert.strictEqual(docStub.calledWith(Statistics.usersToReview), true);
    assert.strictEqual(getStub.calledOnce, true);
    assert.strictEqual(updateStub.calledOnce, true);
    const updatedData = updateStub.getCall(0).args[0];
    assert.strictEqual(updatedData.value, 0);
    assert.strictEqual(typeof updatedData.modified, 'number');
  });
});