"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/app/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>            {/* Redux FIRST (RTK Query context) */}
      <SessionProvider>        {/* NextAuth session provider */}
        <AuthProvider>         {/* Uses RTK Query hooks -> needs Redux above */}
          {children}
        </AuthProvider>
      </SessionProvider>
    </StoreProvider>
  );
}
