'use server';

import { signIn } from 'next-auth/react';

// Server-side redirect for authentication

export async function handleGoogleSignIn() {
  await signIn('google', { callbackUrl: '/' });
}

export async function handleAppleSignIn() {
  // Similar to Google sign-in but for Apple
  const callbackUrl = '/';
  const url = `/api/auth/signin/apple?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;
  return { url };
}
