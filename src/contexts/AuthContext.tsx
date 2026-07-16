"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AppUser } from "@/types";

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAppUser = useCallback(async (uid: string) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAppUser(snap.data() as AppUser);
      }
    } catch {
      // Firestore not configured yet in demo mode
      setAppUser(null);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchAppUser(firebaseUser.uid);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [fetchAppUser]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Create user doc if doesn't exist
    const ref = doc(db, "users", result.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const newUser: AppUser = {
        uid: result.user.uid,
        email: result.user.email ?? "",
        displayName: result.user.displayName ?? "User",
        photoURL: result.user.photoURL ?? undefined,
        role: "client",
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      await setDoc(ref, { ...newUser, serverTimestamp: serverTimestamp() });
      setAppUser(newUser);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    const newUser: AppUser = {
      uid: result.user.uid,
      email,
      displayName,
      role: "client",
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    await setDoc(doc(db, "users", result.user.uid), {
      ...newUser,
      serverTimestamp: serverTimestamp(),
    });
    setAppUser(newUser);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setAppUser(null);
  };

  const isAdmin = appUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        isAdmin,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
