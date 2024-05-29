const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { FirestoreCollections, Order, OrderStatus } = require("rideTypes"); // ?

exports.updateOrder = functions.firestore
  .document(`${FirestoreCollections.orders}/{docId}`)
  .onUpdate(async (change, context) => {
    const db = admin.firestore();
    const newOrder = change.after.data();
    const newOrderStatus = newOrder.status;
    const orderId = context.params.docId;

    let fcmToken = "";
    await getUserFCMToken(db, newOrder.customerId).then(
      (token) => (fcmToken = token)
    );

    let bikerName = "";
    await getBikerName(db, newOrder.bikerId).then((name) => (bikerName = name));

    if (fcmToken != "") {
      if (newOrderStatus == "Pending") {
        await sendMessagePending(orderId, fcmToken);
      } else if (newOrderStatus == "Finished") {
        await sendMessageRating(orderId, fcmToken);
      } else if (newOrderStatus == "AcceptedByBiker") {
        await sendMessageAcceptedBiker(orderId, fcmToken, bikerName);
      } else if (newOrderStatus == "Arriving") {
        await sendMessageArriving(orderId, fcmToken, bikerName);
      }
    }

    await db
      .collection(FirestoreCollections.orders)
      .doc(orderId)
      .update(newOrder);
    return null;
  });

const getUserFCMToken = async (db, userId) => {
  const userSnapshot = await db
    .collection(FirestoreCollections.customers)
    .where("firebaseUserId", "==", userId)
    .get();

  if (!userSnapshot.empty && userSnapshot.docs[0].data().fcmToken) {
    return userSnapshot.docs[0].data().fcmToken;
  } else {
    return "";
  }
};

const getBikerName = async (db, bikerId) => {
  const userSnapshot = await db
    .collection(FirestoreCollections.bikers)
    .where("firebaseUserId", "==", bikerId)
    .get();

  if (!userSnapshot.empty) {
    // eslint-disable-next-line max-len
    const bikerData = userSnapshot.docs[0].data();
    return `${bikerData.firstName} ${bikerData.lastName}`;
  } else {
    return "";
  }
};

const sendMessagePending = async (orderId, fcmToken) => {
  const message = {
    token: fcmToken,
    notification: {
      title: "RIDE Pedido",
      // eslint-disable-next-line max-len
      body: `Nuestros colaboradores de RIDE han procesado tu orden. ¿Te gustaría continuar con el pedido?`,
    },
    data: {
      orderId: orderId,
    },
  };
  await admin.messaging().send(message);
};

const sendMessageAcceptedBiker = async (orderId, fcmToken, bikerName) => {
  const message = {
    token: fcmToken,
    notification: {
      title: "RIDE Pedido",
      // eslint-disable-next-line max-len
      body: `El ciclista ${bikerName} ya va en camino.`,
    },
    data: {
      orderId: orderId,
    },
  };
  await admin.messaging().send(message);
};

const sendMessageArriving = async (orderId, fcmToken, bikerName) => {
  const message = {
    token: fcmToken,
    notification: {
      title: "RIDE Pedido",
      // eslint-disable-next-line max-len
      body: `${bikerName} esta llegando.`,
    },
    data: {
      orderId: orderId,
    },
  };
  await admin.messaging().send(message);
};

const sendMessageRating = async (orderId, fcmToken) => {
  const message = {
    token: fcmToken,
    notification: {
      title: "RIDE Pedido",
      // eslint-disable-next-line max-len
      body: "En RIDE valoramos tu opinión. Califica como fue tu experiencia",
    },
    data: {
      orderId: orderId,
    },
  };
  await admin.messaging().send(message);
};
