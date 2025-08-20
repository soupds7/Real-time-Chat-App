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
  // Customize notification here
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
