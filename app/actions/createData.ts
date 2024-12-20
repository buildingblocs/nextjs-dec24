"use server";

import { getFirebaseAdmin } from "@/app/actions/firebase";
import { cookies } from "next/headers";

export async function createData(value: string) {
    const { adminFirestore, adminAuth } = await getFirebaseAdmin();
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            if (decodedToken?.email) {
                const docRef = adminFirestore.collection("users").doc(decodedToken.email);
                await docRef.update({
                    [Math.random().toString(36).slice(2, 4)]: {
                        name: value,
                        done: false
                    }
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

