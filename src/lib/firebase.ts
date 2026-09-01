import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use the database ID provisioned for this applet if specified
const databaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

export const db = getFirestore(app, databaseId);
export default app;
