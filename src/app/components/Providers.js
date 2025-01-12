'use client';

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {  // Changed to default export
  return <SessionProvider>{children}</SessionProvider>;
}