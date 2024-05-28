const admin = require('firebase-admin');

class UpdateProductAmount {
  /**
   * Crea una instancia de UpdateProductAmount.
   */
  constructor() {
    if (admin.apps.length === 0) {
      admin.initializeApp();
    }
    this.db = admin.firestore();
    // Definir los valores de estado del pedido aquí o como propiedades estáticas de la clase
    this.OrderStatusValues = {
      Pending: 'Pending',
      AssignedToBiker: 'AssignedToBiker'
      // Agregar los demás estados según sea necesario
    };
  }

  /**
   * Actualiza la cantidad disponible de productos cuando un pedido cambia a 'Asignado al repartidor'.
   * @param {Change<DocumentSnapshot>} change - El cambio en el documento del pedido.
   */
  async updateProductAmount(change) {
    const before = change.before.data();
    const after = change.after.data();

    if (
      before.status !== this.OrderStatusValues.AssignedToBiker &&
      after.status === this.OrderStatusValues.AssignedToBiker
    ) {
      const items = after.items;
      const productQuantities = {};

      for (const item of items) {
        if (productQuantities[item.productId]) {
          productQuantities[item.productId]++;
        } else {
          productQuantities[item.productId] = 1;
        }
      }

      for (const productId in productQuantities) {
        if (productId in productQuantities) {
          const productRef = this.db.collection('products').doc(productId); // Utilizar directamente el nombre de la colección
          await this.db.runTransaction(async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists) {
              throw new Error('¡El documento no existe!');
            }
            const productData = productDoc.data();
            if (productData) {
              const quantity = productQuantities[productId];
              if (
                typeof quantity === 'number' &&
                typeof productData.amountAvailable === 'number'
              ) {
                if (productData.amountAvailable !== -1) {
                  const newAmount = productData.amountAvailable - quantity;
                  transaction.update(productRef, { amountAvailable: newAmount });
                }
              } else {
                throw new Error('¡La cantidad o la cantidad disponible no es un número!');
              }
            }
          });
        }
      }
    }
  }
}

module.exports = UpdateProductAmount;

