// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK0E3IaWlmgnxg7Do4oQoAHvoClEcJi5U",
  authDomain: "freight-file-tracker-v2.firebaseapp.com",
  projectId: "freight-file-tracker-v2",
  storageBucket: "freight-file-tracker-v2.firebasestorage.app",
  messagingSenderId: "596797154216",
  appId: "1:596797154216:web:442936d536ecddb6d8f39d"
};

firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'freight-tracker-notification',
    renotify: true,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app and focus on relevant section
    event.waitUntil(
      clients.openWindow('/?notification=true')
    );
  }
});