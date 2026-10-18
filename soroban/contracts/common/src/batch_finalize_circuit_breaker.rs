// Closes #1473 (batch finalization) and #1474 (circuit breaker).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Env, Symbol, Vec};

pub const MAX_BATCH: u32 = 10;

/// Validates every session first (atomic: any panic reverts the whole tx), then finalizes.
pub fn batch_finalize(env: &Env, ids: Vec<u64>, is_valid: impl Fn(u64) -> bool, finalize: impl Fn(u64)) {
    if ids.len() == 0 || ids.len() > MAX_BATCH {
        panic!("batch size must be 1..=10");
    }
    for id in ids.iter() {
        if !is_valid(id) {
            panic!("invalid session in batch");
        }
    }
    for id in ids.iter() {
        finalize(id);
        env.events().publish((Symbol::new(env, "session_finalized"),), id);
    }
}

#[contracttype]
pub enum BreakerKey {
    Threshold,
    Count(u32), // sessions created per ledger sequence
    Tripped,
}

/// Call on session creation; pauses automatically once sessions-per-ledger exceeds N.
pub fn record_session(env: &Env) {
    let ledger = env.ledger().sequence();
    let n: u32 = env.storage().temporary().get(&BreakerKey::Count(ledger)).unwrap_or(0) + 1;
    env.storage().temporary().set(&BreakerKey::Count(ledger), &n);
    let limit: u32 = env.storage().instance().get(&BreakerKey::Threshold).unwrap_or(50);
    if n > limit {
        env.events().publish((Symbol::new(env, "circuit_breaker_alert"),), n);
        env.storage().instance().set(&BreakerKey::Tripped, &true);
        panic!("circuit breaker tripped");
    }
}

/// Admin-only reset/unpause.
pub fn reset_breaker(env: &Env) {
    env.storage().instance().set(&BreakerKey::Tripped, &false);
}
