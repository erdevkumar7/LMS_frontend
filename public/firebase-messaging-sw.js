// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDcnWBTlKteRyy2r93SrWdTKddZX4OSrYE",
  authDomain: "chat-application-bac21.firebaseapp.com",
  projectId: "chat-application-bac21",
  storageBucket: "chat-application-bac21.appspot.com",
  messagingSenderId: "313278847308",
  appId: "1:313278847308:web:115a39f52e959024cfd7e9",
};
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
