// app/providers.tsx
"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import StoreProvider from "./StoreProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/contexts/AuthContext"; // <-- this file

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <StoreProvider>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </StoreProvider>
    </GoogleOAuthProvider>
  );
}
