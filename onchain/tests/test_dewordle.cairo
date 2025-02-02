use starknet::ContractAddress;
use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address
};
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


#[test]
fn test_play_initializes_daily_player_stat() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Call play function
    dewordle.play();

    // Get the daily player stat
    let player_address = starknet::get_caller_address();
    let daily_stat = dewordle.get_player_daily_stat(player_address);

    // Assert initial values
    assert(daily_stat.player == player_address, 'Incorrect player address');
    assert(daily_stat.attempt_remaining == 6, 'Incorrect attempt count');
    assert(!daily_stat.has_won, 'has_won should be false');
    assert(daily_stat.won_at_attempt == 0, 'won_at_attempt should be 0');
}

#[test]
fn test_play_resets_existing_daily_player_stat() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Call play function twice
    dewordle.play();

    // Simulate some gameplay
    dewordle.submit_guess("guess");

    // Call play again to reset
    dewordle.play();

    // Get the daily player stat
    let player_address = starknet::get_caller_address();
    let daily_stat = dewordle.get_player_daily_stat(player_address);

    // Assert reset values
    assert(daily_stat.player == player_address, 'Incorrect player address');
    assert(daily_stat.attempt_remaining == 6, 'Attempt count not reset');
    assert(!daily_stat.has_won, 'has_won not reset');
    assert(daily_stat.won_at_attempt == 0, 'won_at_attempt not reset');
}

#[test]
fn test_play_multiple_players() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    // Player 1
    let player1 = starknet::contract_address_const::<0x1>();
    start_cheat_caller_address(contract_address, player1);
    dewordle.play();
    stop_cheat_caller_address(contract_address);

    // Player 2
    let player2 = starknet::contract_address_const::<0x2>();
    start_cheat_caller_address(contract_address, player2);
    dewordle.play();
    stop_cheat_caller_address(contract_address);

    // Check player 1's stat
    let stat1 = dewordle.get_player_daily_stat(player1);
    assert(stat1.player == player1, 'Incorrect player1 address');
    assert(stat1.attempt_remaining == 6, 'Incorrect attempt count for p1');

    // Check player 2's stat
    let stat2 = dewordle.get_player_daily_stat(player2);
    assert(stat2.player == player2, 'Incorrect player2 address');
    assert(stat2.attempt_remaining == 6, 'Incorrect attempt count for p2');
}

#[test]
fn test_play_after_winning() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Set up a word and play
    dewordle.set_daily_word("test");
    dewordle.play();

    // Simulate winning
    dewordle.submit_guess("test");

    // Play again
    dewordle.play();

    // Check that stats are reset
    let player_address = starknet::get_caller_address();
    let daily_stat = dewordle.get_player_daily_stat(player_address);
    assert(daily_stat.attempt_remaining == 6, 'Attempts not reset after win');
    assert(!daily_stat.has_won, 'has_won not reset after win');
    assert(daily_stat.won_at_attempt == 0, 'won_at_ampt not reset after win');

    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_play_after_losing() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Set up a word and play
    dewordle.set_daily_word("test");
    dewordle.play();

    // Simulate losing (6 incorrect guesses)
    for _ in 0_u8..6_u8 {
        dewordle.submit_guess("wrong");
    };

    // Play again
    dewordle.play();

    // Check that stats are reset
    let player_address = starknet::get_caller_address();
    let daily_stat = dewordle.get_player_daily_stat(player_address);
    assert(daily_stat.attempt_remaining == 6, 'Attempts not reset after loss');
    assert(!daily_stat.has_won, 'has_won should be F after loss');
    assert(daily_stat.won_at_attempt == 0, 'won_at_attempt should be 0');

    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_play_does_not_affect_other_storage() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address: contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Set up initial state
    dewordle.set_daily_word("test");

    // Play
    dewordle.play();

    // Check that daily word is unchanged
    assert(dewordle.get_daily_word() == "test", 'Daily word changed unexpectedly');

    stop_cheat_caller_address(contract_address);
}
