const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Obtiene un documento con la notificación a enviar, y realiza la lógica
 * necesaria para enviar dicha notificación a los dispositivos correspondientes
 */
const AdminPushNotifications = async (title, body, tokens) => {
  const filteredTokens = tokens.filter((token) => token.length > 0);
  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };
  if(filteredTokens.length > 0) {
    const messages = filteredTokens.map((token) => ({
      token: token,
      data: payload,
    }));
    
    await admin.messaging().sendEach(messages);
    console.log('Notifications have been sent and tokens cleaned up.');
  }
};

module.exports = { AdminPushNotifications };