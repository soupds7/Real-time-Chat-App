const admin = require('firebase-admin');
const userModel = require('./models/userModel');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use admin.credential.cert(serviceAccount)
  });
}

async function sendPushNotification(userId, title, body) {
  const user = await userModel.findById(userId);
  if (!user || !user.fcmToken) throw new Error('User or FCM token not found');

  const message = {
    notification: {
      title,
      body,
    },
    token: user.fcmToken,
  };

  return admin.messaging().send(message);
}

module.exports = { sendPushNotification };
