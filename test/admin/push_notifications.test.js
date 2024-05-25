const functions = require('firebase-functions-test')();
const admin = require('firebase-admin');
const assert = require('assert');
const sinon = require('sinon');
const { adminPushNotifications } = require('../../src/admin/push_notifications');

describe('adminPushNotifications', () => {
  let sendEachMock;

  beforeEach(() => {
    sinon.stub(admin, 'initializeApp');    
    sendEachMock = sinon.stub().resolves();
    const messagingStub = sinon.stub().returns({
      sendEach: sendEachMock,
    });
    sinon.stub(admin, 'messaging').get(() => messagingStub);
  });

  afterEach(() => {
    sinon.restore();    
  });

  after(() => {
    functions.cleanup();
  });

  it('should send notifications when tokens are provided', async () => {
    const snapshot = functions.firestore.makeDocumentSnapshot({
      title: 'Test Title',
      body: 'Test Body',
      tokens: ['token1', 'token2']
    }, 'notifications/testNotification');

    const wrappedFunction = functions.wrap(adminPushNotifications);
    await wrappedFunction(snapshot);

    assert.strictEqual(sendEachMock.called, true);    
    const messages = sendEachMock.getCall(0).args[0];
    assert.strictEqual(messages.length, 2);
    assert.deepStrictEqual(messages, [
      { token: 'token1', data: { notification: { title: 'Test Title', body: 'Test Body' } } },
      { token: 'token2', data: { notification: { title: 'Test Title', body: 'Test Body' } } }
    ]);
  });

  it('should not send notifications when there are no tokens', async () => {
    const snapshot = functions.firestore.makeDocumentSnapshot({
      title: 'Test Title',
      body: 'Test Body',
      tokens: []
    }, 'notifications/testNotification');

    const wrappedFunction = functions.wrap(adminPushNotifications);
    await wrappedFunction(snapshot);
    
    assert.strictEqual(sendEachMock.called, false);
  });

  it('should filter out empty tokens', async () => {
    const snapshot = functions.firestore.makeDocumentSnapshot({
      title: 'Test Title',
      body: 'Test Body',
      tokens: ['token1', '', 'token2', '']
    }, 'notifications/testNotification');

    const wrappedFunction = functions.wrap(adminPushNotifications);
    await wrappedFunction(snapshot);

    assert.strictEqual(sendEachMock.called, true);
    const messages = sendEachMock.getCall(0).args[0];
    assert.strictEqual(messages.length, 2);
    assert.deepStrictEqual(messages, [
      { token: 'token1', data: { notification: { title: 'Test Title', body: 'Test Body' } } },
      { token: 'token2', data: { notification: { title: 'Test Title', body: 'Test Body' } } }
    ]);
  });
});
