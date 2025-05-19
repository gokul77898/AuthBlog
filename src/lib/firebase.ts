
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// For Storage (e.g., image uploads in the future)
// import { getStorage } from 'firebase/storage';
// For Firebase Authentication (if you replace the current dummy auth)
// import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY", // TODO: Replace with your actual Firebase config
  authDomain: "YOUR_AUTH_DOMAIN", // TODO: Replace with your actual Firebase config
  projectId: "YOUR_PROJECT_ID", // TODO: Replace with your actual Firebase config
  storageBucket: "YOUR_STORAGE_BUCKET", // TODO: Replace with your actual Firebase config
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // TODO: Replace with your actual Firebase config
  appId: "YOUR_APP_ID", // TODO: Replace with your actual Firebase config
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
// const storage = getStorage(app);
// const auth = getAuth(app);

export { app, db /*, storage, auth */ };
