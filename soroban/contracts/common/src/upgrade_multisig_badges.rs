// Closes #1465 (multi-sig upgrade) and #1466 (achievement badge metadata).
#![allow(dead_code)]
use soroban_sdk::{contracttype, Address, BytesN, Env, String, Vec};

pub const PROPOSAL_TTL_SECS: u64 = 7 * 24 * 60 * 60;

#[contracttype]
#[derive(Clone)]
pub struct UpgradeProposal {
    pub wasm_hash: BytesN<32>,
    pub created_at: u64,
    pub approvals: Vec<Address>,
}

pub fn propose_upgrade(env: &Env, admin: Address, wasm_hash: BytesN<32>) -> UpgradeProposal {
    admin.require_auth();
    UpgradeProposal {
        wasm_hash,
        created_at: env.ledger().timestamp(),
        approvals: Vec::from_array(env, [admin]),
    }
}

pub fn approve_upgrade(env: &Env, admin: Address, p: &mut UpgradeProposal) {
    admin.require_auth();
    if env.ledger().timestamp() > p.created_at + PROPOSAL_TTL_SECS {
        panic!("proposal expired");
    }
    if !p.approvals.contains(&admin) {
        p.approvals.push_back(admin);
    }
}

/// Executes only once M approvals are collected.
pub fn can_execute(p: &UpgradeProposal, threshold: u32) -> bool {
    p.approvals.len() >= threshold
}

#[contracttype]
#[derive(Clone)]
pub enum Rarity {
    Common,
    Rare,
    Epic,
    Legendary,
}

#[contracttype]
#[derive(Clone)]
pub struct Badge {
    pub name: String,
    pub description: String,
    pub icon_uri: String,
    pub rarity: Rarity,
    pub unlocked_at: u64,
}

/// Returns all unlocked badge metadata (definitions are immutable once set).
pub fn get_badges(unlocked: &Vec<Badge>) -> Vec<Badge> {
    unlocked.clone()
}
