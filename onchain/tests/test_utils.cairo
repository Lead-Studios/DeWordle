use dewordle::constants::LetterState;
use dewordle::utils::{
    compare_word, is_correct_hashed_word, hash_word, hash_letter, get_next_midnight_timestamp
};
use starknet::{get_block_timestamp};
const SECONDS_IN_A_DAY: u64 = 86400;

#[test]
fn test_compare_word_when_all_letters_are_correct() {
    let daily_word = array![
        hash_letter('t'.into()),
        hash_letter('e'.into()),
        hash_letter('s'.into()),
        hash_letter('t'.into())
    ];

    assert(
        compare_word(
            daily_word, "test"
        ) == array![
            LetterState::CORRECT, LetterState::CORRECT, LetterState::CORRECT, LetterState::CORRECT
        ]
            .span(),
        'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_misplaced() {
    let daily_word = array![
        hash_letter('t'.into()),
        hash_letter('e'.into()),
        hash_letter('s'.into()),
        hash_letter('t'.into())
    ];

    assert(
        compare_word(
            daily_word, "tset"
        ) == array![
            LetterState::CORRECT, LetterState::PRESENT, LetterState::PRESENT, LetterState::CORRECT
        ]
            .span(),
        'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_absent() {
    let daily_word = array![
        hash_letter('t'.into()),
        hash_letter('e'.into()),
        hash_letter('s'.into()),
        hash_letter('t'.into())
    ];

    assert(
        compare_word(
            daily_word, "tsec"
        ) == array![
            LetterState::CORRECT, LetterState::PRESENT, LetterState::PRESENT, LetterState::ABSENT
        ]
            .span(),
        'Word not compared correctly'
    );
}

#[test]
#[should_panic(expected: 'Length does not match')]
fn test_compare_word_panics() {
    let daily_word = array![
        hash_letter('s'.into()),
        hash_letter('l'.into()),
        hash_letter('e'.into()),
        hash_letter('p'.into()),
        hash_letter('t'.into())
    ];

    compare_word(daily_word, "sweeps");
}

#[test]
fn test_compare_word_when_some_letters_are_repeated() {
    let daily_word = array![
        hash_letter('s'.into()),
        hash_letter('l'.into()),
        hash_letter('e'.into()),
        hash_letter('p'.into()),
        hash_letter('t'.into())
    ];

    assert(
        compare_word(
            daily_word, "sweep"
        ) == array![
            LetterState::CORRECT,
            LetterState::ABSENT,
            LetterState::CORRECT,
            LetterState::ABSENT,
            LetterState::PRESENT
        ]
            .span(),
        'Word not compared correctly'
    );

    let daily_word = array![
        hash_letter('t'.into()),
        hash_letter('e'.into()),
        hash_letter('s'.into()),
        hash_letter('t'.into())
    ];

    assert(
        compare_word(
            daily_word, "less"
        ) == array![
            LetterState::ABSENT, LetterState::CORRECT, LetterState::CORRECT, LetterState::ABSENT
        ]
            .span(),
        'Word not compared correctly'
    );
}

#[test]
fn test_is_correct_hashed_word() {
    let correct_word = hash_word("hello");

    // Test case 1: Correct guess
    let guessed_word = hash_word("hello");
    assert(is_correct_hashed_word(correct_word, guessed_word), 'Test case 1 failed');

    // Test case 2: Incorrect guess
    let guessed_word = hash_word("world");
    assert(!is_correct_hashed_word(correct_word, guessed_word), 'Test case 2 failed');
}

#[test]
fn test_hash_letter() {
    let letter_a = 'a'.into();
    let letter_b = 'b'.into();

    let hash_a = hash_letter(letter_a.clone()); // Clone before passing
    let hash_b = hash_letter(letter_b.clone());

    assert!(hash_a != hash_b, "Different letters");
    assert!(hash_a == hash_letter(letter_a), "Same letter");
}

#[test]
fn test_hash_word() {
    let word1 = "hello";
    let word2 = "world";

    let hash1 = hash_word(word1.clone());
    let hash2 = hash_word(word2.clone());

    assert!(hash1 != hash2, "Different words");
    assert!(hash1 == hash_word(word1), "Same word");
}

#[test]
fn test_get_next_midnight_timestamp() {
    let current_timestamp = get_block_timestamp();
    let expected_midnight = get_next_midnight_timestamp();

    assert(expected_midnight > current_timestamp, 'Midnight must be in future');
    assert(expected_midnight % SECONDS_IN_A_DAY == 0, 'Must align with day boundary');
}
