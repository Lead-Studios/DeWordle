// Closes #1467 (dictionary merkle proof) and #1468 (session time limit).
#![allow(dead_code)]
use soroban_sdk::{Bytes, BytesN, Env, Vec};

/// Verifies `leaf` is in the tree with `root`. Pairs are hashed in sorted order.
pub fn verify_proof(env: &Env, root: BytesN<32>, leaf: BytesN<32>, proof: Vec<BytesN<32>>) -> bool {
    let mut cur = leaf;
    for sib in proof.iter() {
        let mut buf = Bytes::new(env);
        if cur < sib {
            buf.append(&cur.clone().into());
            buf.append(&sib.into());
        } else {
            buf.append(&sib.into());
            buf.append(&cur.clone().into());
        }
        cur = env.crypto().sha256(&buf).to_bytes();
    }
    cur == root
}

/// Panics with a descriptive error when the proof is invalid.
pub fn require_valid_word(env: &Env, root: BytesN<32>, leaf: BytesN<32>, proof: Vec<BytesN<32>>) {
    if !verify_proof(env, root, leaf, proof) {
        panic!("invalid dictionary proof");
    }
}

/// deadline = now + time_limit (0 means no limit).
pub fn deadline(env: &Env, time_limit_secs: u64) -> u64 {
    if time_limit_secs == 0 { 0 } else { env.ledger().timestamp() + time_limit_secs }
}

/// Call at the top of submit_guess; true means the session must be marked lost.
pub fn is_expired(env: &Env, deadline: u64) -> bool {
    deadline != 0 && env.ledger().timestamp() > deadline
}
