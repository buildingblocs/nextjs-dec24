'use client'
import {signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "firebase/auth";
import {auth} from "@/app/firebase";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const provider = new GoogleAuthProvider();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const authCheck = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                router.push("/");
            } else {
                setLoading(false)
            }
        });

        return () => authCheck();
    }, [router]);

    function signIn() {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    const user = result.user;
                    const idToken = await user.getIdToken();
                    document.cookie = `token=${idToken}`;
                    alert(user.email)
                }
            }).catch((error) => {
                alert(error)
            });
    }

    if (loading) {
        return <p>Loading...</p>;
    } else {
        return <button onClick={signIn}>Sign in</button>
    }
}