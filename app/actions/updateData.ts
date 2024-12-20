"use server";

import { getFirebaseAdmin } from "@/app/actions/firebase";
import { cookies } from "next/headers";

export async function updateData(type: "name" | "done", value: string | boolean, id: string) {
    const { adminFirestore, adminAuth } = await getFirebaseAdmin();
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            if (decodedToken?.email) {
                const docRef = adminFirestore.collection("users").doc(decodedToken.email);
                if (type === "name") {
                    await docRef.update({
                        [`${id}.name`]: value,
                    });
                } else if (type === "done") {
                    await docRef.update({
                        [`${id}.done`]: value,
                    });
                }
                return 'OK';
            }
        } catch (e) {
            console.error(e);
            return { status: 401 };
        }
    }
    return { status: 403 };
}