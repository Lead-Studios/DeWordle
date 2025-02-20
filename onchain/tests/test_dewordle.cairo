use dewordle::interfaces::{IDeWordleDispatcher, IDeWordleDispatcherTrait};
use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address
};
use starknet::ContractAddress;

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

    start_cheat_caller_address(contract_address, OWNER());

    // Set up a word and play
    dewordle.set_daily_word("tests");
    dewordle.play();

    // Simulate some gameplay
    match dewordle.submit_guess("guess") {
        Option::None => panic!("ERROR"),
        Option::Some(_) => (),
    }

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
    match dewordle.submit_guess("test") {
        Option::None => (),
        Option::Some(_) => panic!("ERROR"),
    }

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
    dewordle.set_daily_word("tests");
    dewordle.play();

    // Simulate losing (6 incorrect guesses)
    for _ in 0_u8
        ..6_u8 {
            match dewordle.submit_guess("wrong") {
                Option::None => panic!("ERROR"),
                Option::Some(_) => (),
            }
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

#[test]
#[should_panic(expected: 'Length does not match')]
fn test_submit_guess_panics_with_length_does_not_match() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Play
    dewordle.play();

    match dewordle.submit_guess("sweeps") {
        Option::None => panic!("ERROR"),
        Option::Some(_) => panic!("ERROR"),
    }
}

#[test]
#[should_panic(expected: 'Player has already won')]
fn test_submit_guess_panics_with_player_has_already_won() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Play
    dewordle.play();

    match dewordle.submit_guess("slept") {
        Option::None => (),
        Option::Some(_) => panic!("ERROR"),
    }

    match dewordle.submit_guess("slept") {
        Option::None => panic!("ERROR"),
        Option::Some(_) => panic!("ERROR"),
    }
}

#[test]
#[should_panic(expected: 'Player has exhausted attempts')]
fn test_submit_guess_panics_with_player_has_exhausted_attempts() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Play
    dewordle.play();

    // Simulate losing (6 incorrect guesses)
    for _ in 0_u8
        ..6_u8 {
            match dewordle.submit_guess("wrong") {
                Option::None => panic!("ERROR"),
                Option::Some(_) => (),
            }
        };

    match dewordle.submit_guess("wrong") {
        Option::None => panic!("ERROR"),
        Option::Some(_) => (),
    }
}

#[test]
fn test_submit_guess_when_incorrect() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Play
    dewordle.play();

    let daily_stat = dewordle.get_player_daily_stat(OWNER());
    assert(daily_stat.player == OWNER(), 'Wrong player address');
    assert(daily_stat.attempt_remaining == 6, 'attempt_remaining should be 6');
    assert(!daily_stat.has_won, 'has_won should be false');
    assert(daily_stat.won_at_attempt == 0, 'won_at_attempt should be 0');

    match dewordle.submit_guess("wrong") {
        Option::None => panic!("ERROR"),
        Option::Some(_) => (),
    }

    // Check that daily stats are updated accordingly
    let new_daily_stat = dewordle.get_player_daily_stat(OWNER());
    assert(new_daily_stat.player == OWNER(), 'Wrong player address');
    assert(
        new_daily_stat.attempt_remaining == daily_stat.attempt_remaining - 1,
        'Wrongattempt_remaining'
    );
    assert(!new_daily_stat.has_won, 'has_won should be false');
    assert(new_daily_stat.won_at_attempt == 0, 'won_at_attempt should be 0');
}

#[test]
fn test_submit_guess_when_correct() {
    let contract_address = deploy_contract();
    let dewordle = IDeWordleDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());

    // Define and set the daily word
    let daily_word = "slept";
    dewordle.set_daily_word(daily_word.clone());

    // Play
    dewordle.play();

    let daily_stat = dewordle.get_player_daily_stat(OWNER());
    assert(daily_stat.player == OWNER(), 'Wrong player address');
    assert(daily_stat.attempt_remaining == 6, 'attempt_remaining should be 6');
    assert(!daily_stat.has_won, 'has_won should be false');
    assert(daily_stat.won_at_attempt == 0, 'won_at_attempt should be 0');

    match dewordle.submit_guess("slept") {
        Option::None => (),
        Option::Some(_) => panic!("ERROR"),
    }

    // Check that daily stats are updated accordingly
    let new_daily_stat = dewordle.get_player_daily_stat(OWNER());
    assert(new_daily_stat.player == OWNER(), 'Wrong player address');
    assert(
        new_daily_stat.attempt_remaining == daily_stat.attempt_remaining - 1,
        'Wrong attempt_remaining'
    );
    assert(new_daily_stat.has_won, 'has_won should be true');
    assert(
        new_daily_stat.won_at_attempt == 6 - daily_stat.attempt_remaining, 'Wrong won_at_attempt'
    );
}
