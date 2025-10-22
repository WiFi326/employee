// تهيئة Firebase
const firebaseConfig = {
    // ضع هنا معلومات التهيئة الخاصة بمشروع Firebase الخاص بك
    apiKey: "AIzaSyCF7LNSUwCGnraH0i93QEhcANXFrSvYDXc",
  authDomain: "employee-cff05.firebaseapp.com",
  projectId: "employee-cff05",
  storageBucket: "employee-cff05.firebasestorage.app",
  messagingSenderId: "44581865925",
  appId: "1:44581865925:web:0f842797499f85c249a3ac",
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();