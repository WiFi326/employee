// تهيئة Firebase
const firebaseConfig = {
    // ضع هنا معلومات التهيئة الخاصة بمشروع Firebase الخاص بك
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();