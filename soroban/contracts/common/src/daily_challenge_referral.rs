// Closes #1459 (daily challenge) and #1460 (referral tracking).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub struct DailyChallenge {
    pub day: u64,
    pub time_limit_secs: u32,
    pub bonus_multiplier: u32,
    pub theme: String,
}

#[contracttype]
pub enum ChallengeKey {
    Challenge(u64),
    Played(Address, u64),
}

/// Admin-only (caller must verify admin auth) scheduling of a daily challenge.
pub fn schedule_challenge(env: &Env, c: DailyChallenge) {
    env.storage().persistent().set(&ChallengeKey::Challenge(c.day), &c);
}

/// A player may take part in at most one challenge per day.
pub fn join_challenge(env: &Env, player: Address, day: u64) {
    player.require_auth();
    let key = ChallengeKey::Played(player.clone(), day);
    if env.storage().persistent().has(&key) {
        panic!("already participated today");
    }
    env.storage().persistent().set(&key, &true);
    env.events().publish((String::from_str(env, "challenge_joined"), day), player);
}

#[contracttype]
pub enum ReferralKey {
    Referrer(Address),
}

/// Records referrer for `player`; rejects self-referral and circular chains.
pub fn set_referrer(env: &Env, player: Address, referrer: Address) {
    player.require_auth();
    if player == referrer {
        panic!("self referral");
    }
    let mut cur = Some(referrer.clone());
    while let Some(a) = cur {
        if a == player {
            panic!("circular referral");
        }
        cur = env.storage().persistent().get(&ReferralKey::Referrer(a));
    }
    env.storage().persistent().set(&ReferralKey::Referrer(player.clone()), &referrer);
    env.events().publish((String::from_str(env, "referral_set"), player), referrer);
}
