import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  
  plugins: [
    jwtClient() 
  ]
})

export const { signIn, signUp, useSession, signOut } = authClient;

/**
 * Retrieve the JWT token for the currently authenticated user.
 * Can be sent in Authorization: Bearer <token> headers to the backend server.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const res = await authClient.token();
    if (res?.data?.token) {
      return res.data.token;
    }
    // Fallback: direct fetch to Better Auth token endpoint
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data?.token ?? null;
    }
    return null;
  } catch (err) {
    console.warn("Failed to retrieve JWT token:", err);
    return null;
  }
}
