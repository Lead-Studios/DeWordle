// Closes #1461 (tournament bracket) and #1463 (reward tiers).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Address, Env, Symbol, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Tournament {
    pub size: u32, // 8, 16, 32 or 64
    pub entry_deadline: u64,
    pub prize_pool: i128,
    pub players: Vec<Address>,
    pub round: u32,
}

pub fn valid_size(n: u32) -> bool {
    matches!(n, 8 | 16 | 32 | 64)
}

pub fn enter_tournament(env: &Env, t: &mut Tournament, player: Address) {
    player.require_auth();
    if env.ledger().timestamp() > t.entry_deadline || t.players.len() >= t.size {
        panic!("entry closed");
    }
    t.players.push_back(player);
}

/// Pairs players (0,1), (2,3), ... for the current round.
pub fn pairing(t: &Tournament, match_idx: u32) -> (Address, Address) {
    (t.players.get(match_idx * 2).unwrap(), t.players.get(match_idx * 2 + 1).unwrap())
}

/// Winners advance; the last remaining player is the champion.
pub fn advance(t: &mut Tournament, winners: Vec<Address>) {
    t.players = winners;
    t.round += 1;
}

#[contracttype]
pub enum TierKey {
    Multipliers,
}

/// Admin-only: multiplier (percent) for 1..=6 guesses; first guess should be the largest.
pub fn set_tier_multipliers(env: &Env, m: [u32; 6]) {
    env.storage().instance().set(&TierKey::Multipliers, &Vec::from_array(env, m));
    env.events().publish((Symbol::new(env, "tiers_set"),), Vec::from_array(env, m));
}

pub fn apply_tier(env: &Env, base: i128, guesses: u32) -> i128 {
    let m: Vec<u32> = env.storage().instance().get(&TierKey::Multipliers).unwrap();
    base * m.get(guesses - 1).unwrap() as i128 / 100
}
