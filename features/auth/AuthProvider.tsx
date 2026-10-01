"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Sync from local admin session first
    const checkLocalSession = () => {
      try {
        const saved = localStorage.getItem("toty_admin_session");
        if (saved) {
          setUser(JSON.parse(saved));
          setLoading(false);
          return true;
        }
      } catch {}
      return false;
    };

    const hasLocal = checkLocalSession();

    // 2. Listen to custom auth events
    const handleAuthChange = () => {
      checkLocalSession();
    };
    window.addEventListener("toty_auth_change", handleAuthChange);

    // 3. Listen to standard Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
      } else if (!hasLocal) {
        checkLocalSession();
      }
      setLoading(false);
    });

    return () => {
      window.removeEventListener("toty_auth_change", handleAuthChange);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
