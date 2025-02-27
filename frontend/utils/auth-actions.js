'use server';

// Server-side redirect for authentication
export async function handleGoogleSignIn() {
  // This redirects the user to the NextAuth sign-in page with Google provider
  const callbackUrl = '/';

  // Redirect to the NextAuth sign-in URL
  // This uses the HTTP redirect method from Next.js
  const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;

  // Redirect
  return { url };
}

export async function handleAppleSignIn() {
  // Similar to Google sign-in but for Apple
  const callbackUrl = '/';
  const url = `/api/auth/signin/apple?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;
  return { url };
}
