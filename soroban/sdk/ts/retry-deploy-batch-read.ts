// Closes #1478 (retry helper), #1479 (deploy helper), #1480 (batch read helper).
export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  isRetryable?: (err: unknown) => boolean;
  log?: (msg: string) => void;
}

const defaultRetryable = (err: unknown): boolean =>
  /timeout|rate limit|ECONNRESET|429|503/i.test(String((err as Error)?.message ?? err));

export async function submitWithRetry<T>(submit: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, isRetryable = defaultRetryable, log = console.log } = opts;
  for (let attempt = 0; ; attempt++) {
    try {
      return await submit();
    } catch (err) {
      if (attempt >= maxRetries || !isRetryable(err)) throw err;
      log(`retry attempt ${attempt + 1}/${maxRetries}`);
      await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt)); // 1s, 2s, 4s
    }
  }
}

export interface DeployOptions {
  network: 'testnet' | 'local';
  uploadWasm: (wasm: Uint8Array) => Promise<string>;
  deploy: (wasmHash: string) => Promise<string>;
  init: (contractId: string, params: unknown[]) => Promise<void>;
  onEvent?: (name: string, data: unknown) => void;
}

/** Uploads WASM, deploys, initializes, and returns the contract address. */
export async function deployContract(wasm: Uint8Array, initParams: unknown[], o: DeployOptions): Promise<string> {
  const hash = await o.uploadWasm(wasm);
  const id = await o.deploy(hash);
  await o.init(id, initParams);
  o.onEvent?.('contract_deployed', { network: o.network, contractId: id });
  return id;
}

export interface ReadSpec { contract: string; fn: string; args: unknown[] }
export type ReadResult<T> = { ok: true; value: T } | { ok: false; error: unknown };

/** Runs all reads concurrently; results keep input order and failures don't fail the batch. */
export async function batchRead<T = unknown>(
  specs: ReadSpec[],
  read: (s: ReadSpec) => Promise<T>,
): Promise<ReadResult<T>[]> {
  return Promise.all(
    specs.map((s) =>
      read(s).then(
        (value): ReadResult<T> => ({ ok: true, value }),
        (error): ReadResult<T> => ({ ok: false, error }),
      ),
    ),
  );
}
