"use client";

import { AuthProvider } from "react-oidc-context";
import { PropsWithChildren } from "react";

// OIDC Config
const oidcRedirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const oidcConfig = {
  authority:
    process.env.NEXT_PUBLIC_KEYCLOAK_URL +
    "/realms/" +
    process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  redirect_uri: oidcRedirectUri,
  onSigninCallback: () => {
    // Avoid page reload on successful sign-in
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export function AppAuthProvider({ children }: PropsWithChildren) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
