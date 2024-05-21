const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');
const { echo } = require('../../Coope-Logic/index');

describe('Echo Function', () => {
    it('Debería responder con el mismo mensaje que se envió en la solicitud', async () => {
      const message = 'Hola Mundo';
      const req = { body: { message } };
      const res = {
        send: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
  
      await echo(req, res);
  
      sinon.assert.calledWith(res.send, { message });
      sinon.assert.calledWith(res.status, 200);
    });
  });