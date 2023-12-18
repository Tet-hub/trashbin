import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`Check user ${auth}`);
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user };
}
