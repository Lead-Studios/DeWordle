import { handlers } from '@/auth';
export const { GET, POST } = handlers;
// Option 1: Force the route to be static
export const dynamic = 'force-static';

// Option 2: Set a revalidation time (in seconds)
export const revalidate = 3600; // Revalidates every hour
