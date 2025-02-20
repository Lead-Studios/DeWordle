use dewordle::utils::compare_word;

#[test]
fn test_compare_word_when_all_letters_are_correct() {
    let daily_word = "test";

    assert(
        compare_word(daily_word, "test") == array![0, 0, 0, 0].span(), 'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_misplaced() {
    let daily_word = "test";

    assert(
        compare_word(daily_word, "tset") == array![0, 1, 1, 0].span(), 'Word not compared correctly'
    );
}

#[test]
fn test_compare_word_when_some_letters_are_absent() {
    let daily_word = "test";

    assert(
        compare_word(daily_word, "tsec") == array![0, 1, 1, 2].span(), 'Word not compared correctly'
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
        compare_word(daily_word, "sweep") == array![0, 2, 0, 2, 1].span(),
        'Word not compared correctly'
    );

    let daily_word = "test";

    assert(
        compare_word(daily_word, "less") == array![2, 0, 0, 2].span(), 'Word not compared correctly'
    );
}
