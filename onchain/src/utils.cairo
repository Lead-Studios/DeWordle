use core::pedersen::{pedersen};
use dewordle::constants::LetterState;
use starknet::{get_block_timestamp};
const SECONDS_IN_A_DAY: u64 = 86400;

pub fn compare_word(letters: Array<felt252>, guessed_word: ByteArray) -> Span<LetterState> {
    let guessed_word_len = guessed_word.len();

    assert(guessed_word_len == letters.len(), 'Length does not match');

    // Initialize tracking arrays
    let mut i = 0;
    let mut word_states = array![]; // Final letter states
    let mut temp_states = array![]; // Temporary states to track exact matches
    let mut letter_count_list = array![]; // To track letter frequency in the target word

    // Count occurrences of each letter in the daily word
    while (i < guessed_word_len) {
        let mut count: u32 = 0;
        let mut j = 0;
        while (j < guessed_word_len) {
            if is_correct_hashed_word(*letters.at(i), *letters.at(j)) {
                count += 1; // Count occurrences of the letter
            }
            j += 1;
        };
        letter_count_list.append(count);
        i += 1;
    };

    i = 0;

    // Identify exact matches and mark temporary state
    while (i < guessed_word_len) {
        if (hash_letter(guessed_word[i].into()) == *letters.at(i)) {
            temp_states.append(LetterState::CORRECT);
        } else {
            temp_states.append(LetterState::ABSENT);
        }
        i += 1;
    };

    i = 0;

    // Identify misplaced letters
    while (i < guessed_word_len) {
        let prev_word_states = word_states.clone();
        if (*temp_states.at(i) == LetterState::ABSENT) {
            let mut j = 0;
            while (j < guessed_word_len) {
                if (hash_letter(guessed_word[i].into()) == *letters.at(j)) {
                    if (*temp_states.at(j) != LetterState::CORRECT) {
                        word_states.append(LetterState::PRESENT);
                        break;
                    }
                }
                j += 1;
            };

            if (prev_word_states.len() == word_states.len()) {
                word_states.append(LetterState::ABSENT);
            }
        } else {
            word_states.append(LetterState::CORRECT);
        }

        i += 1;
    };

    // Return the final array of letter states
    word_states.span()
}

pub fn is_correct_hashed_word(hashed_word: felt252, hashed_guess: felt252) -> bool {
    hashed_word == hashed_guess
}

pub fn hash_word(word: ByteArray) -> felt252 {
    let mut hash_accumulator = 0;
    let word_len = word.len();

    let mut i = 0;
    while i < word_len {
        hash_accumulator = pedersen(hash_accumulator, word[i].into());
        i += 1;
    };

    hash_accumulator
}

pub fn hash_letter(letter: felt252) -> felt252 {
    pedersen(letter, 0)
}

pub fn get_next_midnight_timestamp() -> u64 {
    let current_timestamp = get_block_timestamp();
    let seconds_since_midnight = current_timestamp % SECONDS_IN_A_DAY;
    current_timestamp - seconds_since_midnight + SECONDS_IN_A_DAY
}
