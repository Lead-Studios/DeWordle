// Closes #1471 (event schema versioning) and #1472 (milestone badge NFTs).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Address, Env, IntoVal, Symbol, Val};

/// Major version of the event schema; bump on breaking event changes.
pub const EVENT_SCHEMA_VERSION: u32 = 1;

pub fn event_schema_version() -> u32 {
    EVENT_SCHEMA_VERSION
}

/// Emit with the schema version as the first topic.
pub fn emit_versioned(env: &Env, name: Symbol, data: Val) {
    env.events().publish((EVENT_SCHEMA_VERSION, name), data);
}

#[contracttype]
pub enum BadgeKey {
    Token(Address, u32), // (player, milestone_type) -> token_id
    NextId,
}

/// Each milestone badge can be minted once per player.
pub fn mint_milestone_badge(env: &Env, player: Address, milestone: u32) -> u32 {
    player.require_auth();
    let key = BadgeKey::Token(player.clone(), milestone);
    if env.storage().persistent().has(&key) {
        panic!("already minted");
    }
    let id: u32 = env.storage().instance().get(&BadgeKey::NextId).unwrap_or(1);
    env.storage().instance().set(&BadgeKey::NextId, &(id + 1));
    env.storage().persistent().set(&key, &id);
    emit_versioned(env, Symbol::new(env, "badge_minted"), (player, milestone, id).into_val(env));
    id
}

pub fn badge_of(env: &Env, player: Address, milestone: u32) -> Option<u32> {
    env.storage().persistent().get(&BadgeKey::Token(player, milestone))
}
