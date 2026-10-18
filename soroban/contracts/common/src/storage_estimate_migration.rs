// Closes #1469 (storage cost estimation) and #1470 (player stats migration).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Env, Symbol};

/// Rough rent estimate in stroops per entry per ledger (tune from network config).
pub const STROOPS_PER_ENTRY_PER_LEDGER: i128 = 10;

#[contracttype]
#[derive(Clone)]
pub struct StorageEstimate {
    pub instance_entries: u32,
    pub persistent_entries: u32,
    pub temporary_entries: u32,
    pub rent_stroops: i128,
    pub projected_stroops: i128,
}

/// Read-only; callable via simulation. `extra_sessions` projects N additional sessions.
pub fn estimate_storage_cost(instance: u32, persistent: u32, temporary: u32, ledgers: u32, extra_sessions: u32) -> StorageEstimate {
    let rent = (instance + persistent + temporary) as i128 * ledgers as i128 * STROOPS_PER_ENTRY_PER_LEDGER;
    let projected = rent + extra_sessions as i128 * ledgers as i128 * STROOPS_PER_ENTRY_PER_LEDGER;
    StorageEstimate { instance_entries: instance, persistent_entries: persistent, temporary_entries: temporary, rent_stroops: rent, projected_stroops: projected }
}

pub const STATS_VERSION: u32 = 2;

/// Idempotent: returns true only the first time a player is migrated to STATS_VERSION.
pub fn migrate_player_stats(env: &Env, current_version: u32) -> (u32, bool) {
    if current_version >= STATS_VERSION {
        return (current_version, false);
    }
    env.events().publish((Symbol::new(env, "stats_migrated"),), STATS_VERSION);
    (STATS_VERSION, true)
}
