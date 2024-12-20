"use server";

import { getFirebaseAdmin } from "@/app/actions/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";

export async function deleteData(id: string) {
    const { adminFirestore, adminAuth } = await getFirebaseAdmin();
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            if (decodedToken?.email) {
                const docRef = adminFirestore.collection("users").doc(decodedToken.email);
                await docRef.update({
                    [id]: FieldValue.delete(),
                });
                return 'OK';
            }
        } catch (e) {
            console.error(e);
            return { status: 401 };
        }
    }
    return { status: 403 };
}