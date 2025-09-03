import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHd9mnNFN5Y3cq7Cfn2mlnvtfFTckfYS8",
  authDomain: "aurelo-a5296.firebaseapp.com",
  projectId: "aurelo-a5296",
  storageBucket: "aurelo-a5296.firebasestorage.app",
  messagingSenderId: "616378226676",
  appId: "1:616378226676:web:1a7ac66ddc28f1f2d7cba1",
  measurementId: "G-MR6VTBVLCS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 