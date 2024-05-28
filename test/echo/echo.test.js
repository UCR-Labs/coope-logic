const assert = require('assert');
const sinon = require('sinon');
const Echo = require('../../src/echo/echo'); 

describe('Echo', () => {
  let echo;
  let request;
  let response;
  let statusStub;
  let sendStub;

  beforeEach(() => {
    echo = new Echo();
    request = { body: {} };
    response = { status: function() {}, send: function() {} };
    statusStub = sinon.stub(response, 'status').returns(response);
    sendStub = sinon.stub(response, 'send');
  });

  afterEach(() => {
    statusStub.restore();
    sendStub.restore();
  });

  it('should return the message received', async () => {
    request.body.message = 'Hola mundo';
    await echo.handleRequest(request, response);
    assert(sendStub.calledOnceWithExactly({ message: 'Hola mundo' }));
  });

  it('should get an error if the message its not found', async () => {
    await echo.handleRequest(request, response);
    assert(statusStub.calledOnceWithExactly(400));
    assert(sendStub.calledOnceWithExactly({ error: 'Se requiere un mensaje.' }));
  });

  it('should manage server errors', async () => {
    const errorMessage = 'Error interno del servidor';
    const errorStub = sinon.stub(console, 'error');
    request.body.message = 'Hola mundo';
    
    // Forzamos un error para simular un error del servidor
    sendStub.throws(new Error(errorMessage));
  
    await echo.handleRequest(request, response);
  
    assert(statusStub.calledOnceWithExactly(500));
    assert(sendStub.calledWith({ error: errorMessage }));
    assert(errorStub.calledOnceWithExactly('Error interno del servidor:', sinon.match.instanceOf(Error)));
  
    errorStub.restore();
  });
});