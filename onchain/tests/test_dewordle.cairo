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
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');
}

#[test]
fn test_compare_word_when_all_letters_are_correct() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    assert(
        dewordle.compare_word("test") == array![0, 0, 0, 0].span(), 'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_misplaced() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    assert(
        dewordle.compare_word("tset") == array![0, 1, 1, 0].span(), 'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_absent() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    assert(
        dewordle.compare_word("tsec") == array![0, 1, 1, 2].span(), 'Word not compared correctly'
    );
}

#[test]
#[should_panic(expected: 'Length does not match')]
fn test_compare_word_panics() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    dewordle.compare_word("sweeps");
}

#[test]
fn test_compare_word_when_some_letters_are_repeated() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    assert(
        dewordle.compare_word("sweep") == array![0, 2, 0, 2, 1].span(),
        'Word not compared correctly'
    );

    // Define and set another daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');

    //  verify the word was compared correctly
    assert(
        dewordle.compare_word("less") == array![2, 0, 0, 2].span(), 'Word not compared correctly'
    );
}
