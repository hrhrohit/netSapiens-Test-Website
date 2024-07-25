// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAX5eUF4JuFBG2kxcSVtaRg2vZKGJimLoI",
  authDomain: "yabbitreseller.firebaseapp.com",
  projectId: "yabbitreseller",
  storageBucket: "yabbitreseller.appspot.com",
  messagingSenderId: "515376714086",
  appId: "1:515376714086:web:d47c2c710de40e257c38a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const createFirebaseUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const saveAccessToken = async (userId, resellerId, accessToken) => {
  try {
    await setDoc(doc(db, 'resellerTokens', userId), {
      resellerId,
      accessToken,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving access token:', error);
    return { success: false, error: error.message };
  }
};

export { db, auth };
