const assert = require('assert');
const sinon = require('sinon');
const axios = require('axios');
const { Geocode } = require('../../src/google_maps/geocode');

describe('Geocode', () => {
  let axiosStub;

  before(() => {
    axiosStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    axiosStub.reset();
  });

  after(() => {
    axiosStub.restore();
  });
 
  it('should return the Geocode from a valid location', async () => {
    const location = '9.957933,-84.072268';
    const apiKey = 'test-api-key';
    const response = {
      data: {
        results: [
          {
            formatted_address: 'WWH5+6PC, San José, Bolivar, Costa Rica'
          }
        ]
      }
    };
    axiosStub.resolves(response);

    const result = await Geocode(location, apiKey);
    assert.deepStrictEqual(result, { address: 'WWH5+6PC, San José, Bolivar, Costa Rica' });
  });
  
  it('should get an error if the Geocode is not found', async () => {
    const location = '0,-160';
    const apiKey = 'test-api-key';
    const response = {
      data: {
        results: []
      }
    };
    axiosStub.resolves(response);    

    try {
      await Geocode(location, apiKey);
      assert.fail('Expected error not thrown');
    } catch (error) {
      assert.strictEqual(error.message, 'Server error');
    }
  });

  it('should manage server errors', async () => {
    const location = '9.957933,-84.072268';
    const apiKey = 'test-api-key';
    axiosStub.rejects(new Error('Server error'));

    try {
      await Geocode(location, apiKey);
      assert.fail('Expected error not thrown');
    } catch (error) {
      assert.strictEqual(error.message, 'Server error');
    }
  });
});