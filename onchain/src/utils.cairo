use dewordle::constants::LetterStates::{CORRECT, PRESENT, ABSENT};

pub fn compare_word(word: ByteArray, guessed_word: ByteArray) -> Span<u8> {
    let guessed_word_len = guessed_word.len();

    assert(guessed_word_len == word.len(), 'Length does not match');

    //  Initialize tracking arrays
    let mut i = 0;
    let mut word_states = array![]; // Final letter states
    let mut temp_states = array![]; // Temporary states to track exact matches
    let mut letter_count_list = array![]; // To track letter frequency in the target word

    //  Count occurrences of each letter in the daily word
    while (i < guessed_word_len) {
        let mut count: u32 = 0;
        let mut j = 0;
        while (j < guessed_word_len) {
            if (word[i] == word[j]) {
                count += 1; // Count occurrences of the letter
            }
            j += 1;
        };
        letter_count_list.append(count);
        i += 1;
    };

    i = 0;

    //  Identify exact matches and mark temporary state
    while (i < guessed_word_len) {
        if (guessed_word[i] == word[i]) {
            temp_states.append(CORRECT); // Letter is in the correct position
        } else {
            temp_states.append(ABSENT); // Default to ABSENT for now
        }
        i += 1;
    };

    i = 0;

    //  Identify misplaced letters
    while (i < guessed_word_len) {
        let prev_word_states = word_states.clone();
        // If the letter was marked ABSENT in the temporary states, check for misplaced
        // occurrences
        if (*temp_states.at(i) == ABSENT) {
            let mut j = 0;
            while (j < guessed_word_len) {
                if (guessed_word[i] == word[j]) {
                    if (*temp_states.at(j) != CORRECT) {
                        word_states.append(PRESENT); // Mark as PRESENT (misplaced)
                        break;
                    }
                }
                j += 1;
            };

            // If no match was found, mark as ABSENT
            if (prev_word_states.len() == word_states.len()) {
                word_states.append(ABSENT);
            }
        } else {
            // If the letter was previously marked as CORRECT, preserve the state
            word_states.append(CORRECT);
        }

        i += 1;
    };

    // Return the final array of letter states
    word_states.span()
}

pub fn is_correct_word(correct_word: ByteArray, guessed_word: ByteArray) -> bool {
    guessed_word == correct_word
}
