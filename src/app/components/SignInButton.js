'use client';

import { signIn } from "next-auth/react";

export default function SignInButton() {
  const handleSignIn = async () => {
    await signIn('google', { 
      callbackUrl: '/',
      redirect: true
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-6 py-3 bg-lime-600 text-white font-bold rounded-lg shadow-md hover:bg-lime-500 transition-all"
    >
      Sign in with Google
    </button>
  );
} 