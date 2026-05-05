import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADLIlxH_NTXtuEYAZfDiWXZCPW1QiICqU",
  authDomain: "shimai-map.firebaseapp.com",
  projectId: "shimai-map",
  storageBucket: "shimai-map.firebasestorage.app",
  messagingSenderId: "261910717943",
  appId: "1:261910717943:web:4394aa51abb88a267e3af2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
