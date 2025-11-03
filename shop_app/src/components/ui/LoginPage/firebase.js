
/*
import {initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider, signInWithPopup};
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 1. Initialize Firebase App using Environment Variables (VITE)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// 2. Main function to handle Google sign-in and token forwarding
const handleGoogleSignIn = async (apiClient) => {
    try {
        // Step A: Sign in with a pop-up window
        const result = await signInWithPopup(auth, googleProvider);

        // Step B: Get the ID token from the user credential
        const idToken = await result.user.getIdToken();

        // Step C: Send the ID token to your Django backend for verification
        const response = await apiClient.post("auth/google/", {
            id_token: idToken
        });

        // The Django backend response should contain JWT tokens and user data
        return response.data;

    } catch (error) {
        // Handle errors from Firebase (e.g., pop-up closed, network issue)
        console.error("Google Sign-in failed:", error.message);

        // Handle errors from the Django API call (e.g., token verification failed)
        if (error.response) {
            console.error("Django API Error:", error.response.data);
        }
        throw error;
    }
};


// 3. Export necessary components and the new flow function
// We export the provider under two names for compatibility with older code if needed
export {
    auth,
    googleProvider,
    googleProvider as provider,
    signInWithPopup,
    handleGoogleSignIn
};
