import { getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

export function getDB(): {db: Firestore} {
  if (getApps().length == 0) {
    const firebaseCfg = {
      apiKey: process.env.PUBLIC_FB_API_KEY,
      authDomain: process.env.PUBLIC_FB_AUTH_DOMAIN,
      projectId:process.env. PUBLIC_FB_PROJECT_ID,
      storageBucket: process.env.PUBLIC_FB_STORAGE_BUCKET,
      messagingSenderId: process.env.PUBLIC_FB_MESSAGING_SENDER_ID,
      appId: process.env.PUBLIC_FB_APP_ID,
    };

    initializeApp(firebaseCfg);
  }

  return { db: getFirestore() };
}