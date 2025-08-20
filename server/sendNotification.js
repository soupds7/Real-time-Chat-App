const admin = require('firebase-admin');
const userModel = require('./models/userModel');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('../soup-inbox-firebase-adminsdk-fbsvc-8e960c9b31.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'soup-inbox'
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
  console.log('Sending push notification:', message);
  return admin.messaging().send(message);
}

module.exports = { sendPushNotification };
