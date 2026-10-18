// Closes #1482 (wallet state machine), #1483 (simulation wrapper), #1484 (offline queue).
export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error' | 'network_mismatch';
type Listener = (next: WalletState, prev: WalletState) => void;

export class WalletStateMachine {
  private state: WalletState = 'disconnected';
  private listeners = new Set<Listener>();
  private retries = 0;
  constructor(private maxRetries = 3) {}

  get current(): WalletState { return this.state; }
  subscribe(l: Listener): () => void { this.listeners.add(l); return () => this.listeners.delete(l); }

  transition(next: WalletState): void {
    const prev = this.state;
    this.state = next;
    this.listeners.forEach((l) => l(next, prev));
  }

  /** Auto-reconnect on disconnect, up to maxRetries. */
  async onDisconnect(connect: () => Promise<void>): Promise<void> {
    this.transition('disconnected');
    while (this.retries < this.maxRetries) {
      this.retries++;
      this.transition('connecting');
      try {
        await connect();
        this.retries = 0;
        this.transition('connected');
        return;
      } catch {
        /* retry */
      }
    }
    this.transition('error');
  }

  checkNetwork(expected: string, actual: string): void {
    if (expected !== actual) this.transition('network_mismatch');
  }
}

export interface SimulationResult { cpuInstructions: number; memoryBytes: number; storageOps: number; feeXlm: number }

/** Dry-runs a call via the RPC simulateTransaction endpoint without spending tokens. */
export async function simulate(
  simulateTx: () => Promise<{ cpu: number; mem: number; ops: number; feeStroops: number }>,
): Promise<SimulationResult> {
  const r = await simulateTx();
  return { cpuInstructions: r.cpu, memoryBytes: r.mem, storageOps: r.ops, feeXlm: r.feeStroops / 1e7 };
}

const QUEUE_KEY = 'dewordle.txQueue';
const MAX_QUEUE = 10;
const TTL_MS = 60 * 60 * 1000;
interface Queued { xdr: string; at: number }

const load = (): Queued[] => JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
const save = (q: Queued[]) => localStorage.setItem(QUEUE_KEY, JSON.stringify(q));

/** Stores an unsigned transaction locally (max 10, entries older than 1h purged). */
export function queueTransaction(xdr: string): boolean {
  const q = load().filter((t) => Date.now() - t.at < TTL_MS);
  if (q.length >= MAX_QUEUE) return false;
  q.push({ xdr, at: Date.now() });
  save(q);
  return true;
}

/** Submits queued transactions when connectivity returns. */
export function autoFlush(submit: (xdr: string) => Promise<void>): void {
  window.addEventListener('online', async () => {
    const q = load().filter((t) => Date.now() - t.at < TTL_MS);
    save([]);
    for (const t of q) await submit(t.xdr);
  });
}
