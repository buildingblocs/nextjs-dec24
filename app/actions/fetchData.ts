"use server";

import { getFirebaseAdmin } from "@/app/actions/firebase";
import { cookies } from "next/headers";

export async function fetchData() {
    const { adminFirestore, adminAuth } = await getFirebaseAdmin();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            if (decodedToken?.email) {
                const docRef = adminFirestore.collection("users").doc(decodedToken.email);
                const doc = await docRef.get();
                if (!doc.exists) {
                    await adminFirestore.collection("users").doc(decodedToken.email).set({});
                    return {};
                } else {
                    return doc.data();
                }
            }
        } catch (e) {
            console.error(e);
            return {status: 401};
        }
    }
    return {status: 403};
}
