// Closes #1457 (response compression) and #1458 (on-chain result verification).
import compression from 'compression';
import type { RequestHandler } from 'express';

/** gzip responses larger than 1KB, negotiated via Accept-Encoding. Apply globally: app.use(compressionMiddleware). */
export const compressionMiddleware: RequestHandler = compression({
  threshold: 1024,
  level: 6,
});

export interface VerificationResult {
  sessionId: string;
  matches: boolean;
  verifiedAt: Date;
}

/** Percentage of finalized sessions sampled for verification (default 5). */
export const VERIFY_SAMPLE_PERCENT = Number(process.env.VERIFY_SAMPLE_PERCENT ?? 5);

export function shouldVerify(random: () => number = Math.random): boolean {
  return random() * 100 < VERIFY_SAMPLE_PERCENT;
}

/** Compare indexed outcome with on-chain outcome; mismatches are logged as critical. */
export function verifySession(
  sessionId: string,
  indexedOutcome: string,
  onChainOutcome: string,
  log: (msg: string) => void = console.error,
): VerificationResult {
  const matches = indexedOutcome === onChainOutcome;
  if (!matches) {
    log(`CRITICAL: session ${sessionId} mismatch indexed=${indexedOutcome} onchain=${onChainOutcome}`);
  }
  return { sessionId, matches, verifiedAt: new Date() };
}
