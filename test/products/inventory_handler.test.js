const assert = require('assert');
const sinon = require('sinon');
const UpdateProductAmount = require('../../src/products/inventory_handler');

describe('UpdateProductAmount', () => {
    let updateProductAmount;
    let change;
    let dbStub;
    let transactionStub;
    let getStub;
    let updateStub;
  
    beforeEach(() => {
      updateProductAmount = new UpdateProductAmount();
      change = {
        before: { data: () => ({ status: 'Pending' }) },
        after: { data: () => ({ status: 'AssignedToBiker', items: [{ productId: '1' }] }) }
      };
      dbStub = sinon.stub(updateProductAmount, 'db').value({
        collection: sinon.stub().returnsThis(),
        runTransaction: sinon.stub().callsFake(async (callback) => {
          await callback({
            get: getStub = sinon.stub().returns({ exists: true, data: () => ({ amountAvailable: 10 }) }),
            update: updateStub = sinon.stub()
          });
        })
      });
      transactionStub = sinon.stub();
    });
  
    afterEach(() => {
      dbStub.restore();
    });
  
    it('should update product amount when order status changes to "AssignedToBiker"', async () => {
      await updateProductAmount.updateProductAmount(change);
      assert(dbStub.collection.calledWith('products'));
      assert(getStub.calledWith(sinon.match({ id: '1' })));
      assert(updateStub.calledWith(sinon.match({ amountAvailable: 9 })));
    });
  
    it('should not update product amount if order status does not change to "AssignedToBiker"', async () => {
      change.after.data = () => ({ status: 'Processing', items: [{ productId: '1' }] });
      await updateProductAmount.updateProductAmount(change);
      assert(dbStub.collection.notCalled);
      assert(getStub.notCalled);
      assert(updateStub.notCalled);
    });
  
    it('should throw an error if product document does not exist', async () => {
      getStub.returns({ exists: false });
      await assert.rejects(updateProductAmount.updateProductAmount(change), { message: '¡El documento no existe!' });
    });
  
    it('should throw an error if product amountAvailable is not a number', async () => {
      getStub.returns({ exists: true, data: () => ({ amountAvailable: '10' }) });
      await assert.rejects(updateProductAmount.updateProductAmount(change), { message: '¡La cantidad o la cantidad disponible no es un número!' });
    });
  });