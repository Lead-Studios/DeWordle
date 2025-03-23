import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const authOptions = {
  providers: [Google],
};

const authHandler = NextAuth(authOptions);

export const { GET, POST, signIn } = authHandler;

export { authHandler as handlers };
