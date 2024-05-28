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

  it('should not call sendEach if tokens are empty', async () => {
    await adminPushNotifications('Title', 'Body', []);
    assert.strictEqual(sendEachMock.called, false);
  });

  it('should not call sendEach if all tokens are empty strings', async () => {
    await adminPushNotifications('Title', 'Body', ['', '', '']);
    assert.strictEqual(sendEachMock.called, false);
  });

  it('should call sendEach with correct messages if there are valid tokens', async () => {
    const tokens = ['token1', 'token2'];
    const expectedMessages = tokens.map(token => ({
      token: token,
      data: {
        notification: {
          title: 'Title',
          body: 'Body',
        },
      },
    }));

    await adminPushNotifications('Title', 'Body', tokens);
    assert.strictEqual(sendEachMock.calledOnce, true);
    assert.deepStrictEqual(sendEachMock.firstCall.args[0], expectedMessages);
  });

  it('should handle mixed valid and empty tokens', async () => {
    const tokens = ['token1', '', 'token2', ''];
    const expectedMessages = ['token1', 'token2'].map(token => ({
      token: token,
      data: {
        notification: {
          title: 'Title',
          body: 'Body',
        },
      },
    }));
    
    await adminPushNotifications('Title', 'Body', tokens);
    assert.strictEqual(sendEachMock.calledOnce, true);
    assert.deepStrictEqual(sendEachMock.firstCall.args[0], expectedMessages);
  });
});
