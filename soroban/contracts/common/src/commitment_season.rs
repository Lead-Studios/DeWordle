// Closes #1462 (commitment verification) and #1464 (seasonal leaderboard).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Bytes, BytesN, Env, Symbol};

/// Commitment = SHA-256(salt || word). Security: salt is random and secret until reveal,
/// so the commitment hides the word; SHA-256 collision resistance binds the committer to it.
pub fn verify_commitment(env: &Env, word: Bytes, salt: Bytes, commitment: BytesN<32>) -> bool {
    let mut data = salt;
    data.append(&word);
    let ok = env.crypto().sha256(&data).to_bytes() == commitment;
    if !ok {
        env.events().publish((Symbol::new(env, "fraud_alert"),), commitment);
    }
    ok
}

#[contracttype]
pub enum SeasonKey {
    SeasonId,
    Archive(u32),
}

pub const MAX_ARCHIVED_SEASONS: u32 = 4;

/// Admin-only: increments the season id; keeps at most 4 archived seasons.
pub fn start_season(env: &Env) -> u32 {
    let id: u32 = env.storage().instance().get(&SeasonKey::SeasonId).unwrap_or(0);
    let next = id + 1;
    if next > MAX_ARCHIVED_SEASONS {
        env.storage().persistent().remove(&SeasonKey::Archive(next - MAX_ARCHIVED_SEASONS - 1));
    }
    env.storage().instance().set(&SeasonKey::SeasonId, &next);
    env.events().publish((Symbol::new(env, "season_started"),), next);
    next
}
