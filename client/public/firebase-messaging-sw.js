importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDv3j-WvzJPdlYbrndAAhdPzcTkd77wQkk",
  authDomain: "soup-inbox.firebaseapp.com",
  projectId: "soup-inbox",
  storageBucket: "soup-inbox.firebasestorage.app",
  messagingSenderId: "966988397775",
  appId: "1:966988397775:web:0f5bc9f206a9959e720bba",
  measurementId: "G-M62VP0X1QY"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  // Vibrate device and show notification with click action
  const senderId = payload.data && payload.data.senderId;
  const options = {
    body: payload.notification.body,
    vibrate: [200, 100, 200], // Vibrate pattern
    data: {
      url: senderId ? `/chat/${senderId}` : '/', // URL to redirect on click
    },
    // icon: '/logo192.png', // Optional: add icon
  };
  self.registration.showNotification(payload.notification.title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Redirect to sender's chat box
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
