use dewordle::constants::LetterState;
use dewordle::utils::{compare_word, is_correct_word};

#[test]
fn test_compare_word_when_all_letters_are_correct() {
    let daily_word = "test";

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
    let daily_word = "test";

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
    let daily_word = "test";

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
    let daily_word = "slept";

    compare_word(daily_word, "sweeps");
}

#[test]
fn test_compare_word_when_some_letters_are_repeated() {
    let daily_word = "slept";

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

    let daily_word = "test";

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
fn test_is_correct_word() {
    let correct_word = "hello";

    // Test case 1: Correct guess
    let guessed_word = "hello";
    let result = is_correct_word(correct_word.clone(), guessed_word.clone());
    assert(result, 'Test case 1 failed');

    // Test case 2: Incorrect guess
    let guessed_word = "world";
    let result = is_correct_word(correct_word, guessed_word.clone());
    assert(!result, 'Test case 2 failed');
}
