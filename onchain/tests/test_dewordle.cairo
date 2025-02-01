use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address};
use dewordle::interfaces::{IDeWordleDispatcher, IDeWordleDispatcherTrait};

fn OWNER() -> ContractAddress {
    'OWNER'.try_into().unwrap()
}

fn deploy_contract() -> ContractAddress {
    let contract = declare("DeWordle").unwrap().contract_class();
    let mut constructor_calldata = array![];
    let owner: ContractAddress = OWNER().try_into().unwrap();
    owner.serialize(ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_set_daily_word() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "test";
    dewordle.set_daily_word(daily_word.clone());

    // Verify that the daily word was set correctly
    assert(dewordle.get_daily_word() == daily_word, 'Daily word not stored correctly');
}

#[test]
fn test_is_correct_word() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());
    // Set the correct word in the contract state
    let correct_word = "hello";
    dewordle.set_daily_word(correct_word.clone());

    // Test case 1: Correct guess
    let guessed_word = "hello";
    let result = dewordle.is_correct_word(guessed_word.clone());
    assert(result, 'Test case 1 failed');

    // Test case 2: Incorrect guess
    let guessed_word = "world";
    let result = dewordle.is_correct_word(guessed_word.clone());
    assert(!result, 'Test case 2 failed');
}

#[test]
fn test_compare_word_when_all_letters_are_correct() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());
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

    start_cheat_caller_address(contract_address, OWNER());
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

    start_cheat_caller_address(contract_address, OWNER());
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

    start_cheat_caller_address(contract_address, OWNER());
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

    start_cheat_caller_address(contract_address, OWNER());
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

    // Verify the word was compared correctly
    assert(
        dewordle.compare_word("less") == array![2, 0, 0, 2].span(), 'Word not compared correctly'
    );
}
