import React, { createContext, useContext, useState } from 'react';
import { signInWithGoogle, signOut } from './firebaseConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);

  const signIn = async () => {
    const user = await signInWithGoogle();
    setUser(user);
  };

  const signOutUser = () => {
    signOut();
    setUser(null);
    setAccessGranted(false);
  };

  return (
    <AuthContext.Provider value={{ user, accessGranted, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
