import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase automatically persists login state across refreshes.
    // onAuthStateChanged fires once on load with the current user (or null).
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // cleans up the listener when the app unmounts
  }, []);

  function logout() {
    return signOut(auth);
  }

  async function updateDisplayName(name) {
    await updateProfile(auth.currentUser, { displayName: name });
    setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser)); // force re-render with updated name
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateDisplayName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
