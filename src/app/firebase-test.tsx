'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function FirebaseTest() {
  const [testStatus, setTestStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    async function testFirebase() {
      try {
        // Test document reference
        const testRef = doc(db, 'test', 'firebase-connection-test');
        
        // Try to write to Firestore
        await setDoc(testRef, {
          timestamp: new Date(),
          message: 'Firebase connection test'
        });
        
        // Try to read from Firestore
        const docSnap = await getDoc(testRef);
        
        if (docSnap.exists()) {
          setTestStatus('success');
        } else {
          throw new Error('Document exists but data could not be retrieved');
        }
      } catch (error) {
        setTestStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        console.error('Firebase test failed:', error);
      }
    }
    
    testFirebase();
  }, []);
  
  return (
    <div className="p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Firebase Connection Test</h2>
      
      {testStatus === 'loading' && (
        <div className="animate-pulse">Testing connection...</div>
      )}
      
      {testStatus === 'success' && (
        <div className="text-green-500 font-semibold">
          ✅ Firebase connection successful!
        </div>
      )}
      
      {testStatus === 'error' && (
        <div className="text-red-500 font-semibold">
          ❌ Firebase connection failed
          {errorMessage && (
            <p className="text-sm mt-2">{errorMessage}</p>
          )}
        </div>
      )}
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
      </div>
    </div>
  );
} 