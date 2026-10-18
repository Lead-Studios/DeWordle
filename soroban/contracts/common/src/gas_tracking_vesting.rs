// Closes #1475 (cross-contract gas tracking) and #1476 (reward vesting).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Address, Env, Symbol};

/// Wrap a cross-contract call; emits the budget delta as a diagnostic event.
pub fn tracked_call<T>(env: &Env, label: Symbol, call: impl FnOnce() -> T) -> T {
    let before = env.cost_estimate().budget().cpu_instruction_cost();
    let out = call();
    let after = env.cost_estimate().budget().cpu_instruction_cost();
    env.events().publish((Symbol::new(env, "gas_used"), label), after.saturating_sub(before));
    out
}

#[contracttype]
#[derive(Clone)]
pub struct Vesting {
    pub total: i128,
    pub claimed: i128,
    pub start: u64,
    pub duration: u64,
}

pub fn vested_amount(env: &Env, v: &Vesting) -> i128 {
    let elapsed = env.ledger().timestamp().saturating_sub(v.start);
    if elapsed >= v.duration {
        v.total
    } else {
        v.total * elapsed as i128 / v.duration as i128
    }
}

/// Unvested balance, queryable per player.
pub fn unvested(env: &Env, v: &Vesting) -> i128 {
    v.total - vested_amount(env, v)
}

/// Releases the vested-but-unclaimed portion.
pub fn claim_vested(env: &Env, player: Address, v: &mut Vesting) -> i128 {
    player.require_auth();
    let amount = vested_amount(env, v) - v.claimed;
    v.claimed += amount;
    amount
}
