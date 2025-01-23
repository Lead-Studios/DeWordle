use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use dewordle::interfaces::{IDeWordleDispatcher, IDeWordleDispatcherTrait};

fn deploy_contract() -> ContractAddress {
    let contract = declare("DeWordle").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}

#[test]
fn test_set_daily_word() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(
        dewordle.get_daily_word() == daily_word,
        'Daily word not stored correctly'
    );
}
