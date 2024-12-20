"use server";

import { getApps, initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app: ReturnType<typeof initializeApp> | undefined;

async function initializeFirebaseAdmin() {
    if (!getApps().length && process.env.FB_ADMIN) {
        app = initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.FB_ADMIN)),
        });
    }

    if (!app) {
        throw new Error("Firebase admin does not exist");
    }

    return {
        adminAuth: getAuth(app),
        adminFirestore: getFirestore(app)
    };
}

export const getFirebaseAdmin = initializeFirebaseAdmin;
